const { Sequelize, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Course = require('./Course')(sequelize, Sequelize.DataTypes);
const Lesson = require('./Lesson')(sequelize, Sequelize.DataTypes);
const Question = require('./Question')(sequelize, Sequelize.DataTypes);
const Enrollment = require('./Enrollment')(sequelize, Sequelize.DataTypes);
const Progress = require('./Progress')(sequelize, Sequelize.DataTypes);
const Activity = require('./Activity')(sequelize, Sequelize.DataTypes);
const QuizAttempt = require('./QuizAttempt')(sequelize, Sequelize.DataTypes);
const AdminAuditLog = require('./AdminAuditLog')(sequelize, Sequelize.DataTypes);
const AdminSettings = require('./AdminSettings')(sequelize, Sequelize.DataTypes);
const Category = require('./Category')(sequelize, Sequelize.DataTypes);
const Certificate = require('./Certificate')(sequelize, Sequelize.DataTypes);
const CertificatePayment = require('./CertificatePayment')(sequelize, Sequelize.DataTypes);

// Define Associations

// User Associations
User.hasMany(Enrollment, { foreignKey: 'userId' });
Enrollment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Activity, { foreignKey: 'userId' });
Activity.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(QuizAttempt, { foreignKey: 'userId' });
QuizAttempt.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(AdminAuditLog, { foreignKey: 'adminId' });
AdminAuditLog.belongsTo(User, { foreignKey: 'adminId' });

User.hasMany(Certificate, { foreignKey: 'userId' });
Certificate.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(CertificatePayment, { foreignKey: 'userId' });
CertificatePayment.belongsTo(User, { foreignKey: 'userId' });

// Course Associations
Course.hasMany(Lesson, { foreignKey: 'courseId', sourceKey: 'courseId' });
Lesson.belongsTo(Course, { foreignKey: 'courseId', targetKey: 'courseId' });

Course.hasMany(Question, { foreignKey: 'courseId', sourceKey: 'courseId' });
Question.belongsTo(Course, { foreignKey: 'courseId', targetKey: 'courseId' });
[
    Enrollment, Progress, QuizAttempt, Certificate, CertificatePayment
].forEach(Model => {
    Course.hasMany(Model, { foreignKey: 'courseId', sourceKey: 'courseId' });
    Model.belongsTo(Course, { foreignKey: 'courseId', targetKey: 'courseId', as: 'Course' });
});

// Keep the public model surface compatible while routes are migrated incrementally.
// These helpers still execute through Sequelize (not a second persistence layer).
const fields = value => Object.keys(value || {}).filter(k => !k.startsWith('$'));
const whereFor = query => {
    if (!query || typeof query !== 'object') return {};
    if (query.where && typeof query.where === 'object' && !Array.isArray(query.where)) {
        return whereFor(query.where);
    }
    const out = {};
    Object.entries(query || {}).forEach(([key, value]) => {
        const fieldKey = key === '_id' ? 'id' : key;
        if (fieldKey === '$or' && Array.isArray(value)) {
            out[Op.or] = value.map(whereFor);
        } else if (fieldKey === '$and' && Array.isArray(value)) {
            out[Op.and] = value.map(whereFor);
        } else if (value instanceof RegExp) {
            out[fieldKey] = { [Op.like]: `%${value.source}%` };
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
            if (value._id || value.id) {
                out[fieldKey] = value.id || value._id;
            } else if ('$in' in value) {
                out[fieldKey] = { [Op.in]: value.$in };
            } else if ('$ne' in value) {
                out[fieldKey] = { [Op.ne]: value.$ne };
            } else if ('$regex' in value) {
                out[fieldKey] = { [Op.like]: `%${value.$regex}%` };
            } else {
                out[fieldKey] = value;
            }
        } else {
            out[fieldKey] = value;
        }
    });
    return out;
};
const attachCompat = Model => {
    const native = {
        findAll: Model.findAll.bind(Model), findOne: Model.findOne.bind(Model),
        findByPk: Model.findByPk.bind(Model), count: Model.count.bind(Model),
        aggregate: Model.aggregate.bind(Model)
    };
    Object.defineProperty(Model.prototype, '_id', { get() { return this.id; }, set(v) { this.id = v; } });
    Model.prototype.toObject = function () { return this.get({ plain: true }); };
    const query = (method, args, chain = {}) => {
        const execute = async () => {
            const options = { where: whereFor(args[0] || {}) };
            if (chain.order) options.order = chain.order;
            if (chain.limit) options.limit = chain.limit;
            if (chain.attributes) options.attributes = chain.attributes;
            if (chain.populate) options.include = chain.populate;
            const result = await native[method](options);
            if (chain.populate && chain.populate.association === 'User') {
                const rows = Array.isArray(result) ? result : [result];
                rows.forEach(row => {
                    if (row && row.User) {
                        row.setDataValue('userId', row.User);
                        delete row.dataValues.User;
                    }
                });
            }
            return result;
        };
        const queryObj = {
            then(resolve, reject) {
                return execute().then(resolve, reject);
            },
            catch(reject) {
                return execute().catch(reject);
            },
            finally(callback) {
                return execute().finally(callback);
            },
            sort(value) {
                const order = Object.entries(value || {}).map(([k, v]) => [k, String(v).toLowerCase() === 'desc' ? 'DESC' : 'ASC']);
                return query(method, args, { ...chain, order });
            },
            limit(value) {
                return query(method, args, { ...chain, limit: value });
            },
            select(value) {
                return query(method, args, {
                    ...chain,
                    attributes: String(value).split(/\s+/).some(name => name.startsWith('+'))
                        ? undefined
                        : String(value).split(/\s+/).filter(Boolean)
                });
            },
            populate(association, fields) {
                const associationName = association === 'userId' ? 'User' :
                    association === 'courseId' ? 'Course' : association;
                const include = { association: associationName };
                if (fields) include.attributes = String(fields).split(/\s+/).filter(Boolean);
                return query(method, args, { ...chain, populate: include });
            }
        };
        return queryObj;
    };
    Model.find = (...args) => query('findAll', args);
    Model.findOne = (...args) => query('findOne', args);
    Model.findById = id => {
        const rawId = (id && typeof id === 'object') ? (id.id || id._id || id) : id;
        return query('findOne', [{ id: rawId }]);
    };
    Model.findByPk = (id, options = {}) => {
        const rawId = (id && typeof id === 'object') ? (id.id || id._id || id) : id;
        return native.findOne({ ...options, where: { id: rawId } });
    };
    Model.countDocuments = async queryObj => {
        try {
            const rows = await native.findAll({ where: whereFor(queryObj || {}), attributes: ['id'], raw: true });
            return rows.length;
        } catch (e) {
            return 0;
        }
    };
    Model.findOneAndUpdate = async (filter, update, options = {}) => {
        const row = await native.findOne({ where: whereFor(filter || {}) });
        if (!row && options.upsert) {
            const data = { ...(filter || {}), ...(update.$set || update) };
            if (data._id && !data.id) { data.id = data._id; delete data._id; }
            return Model.create(data);
        }
        if (!row) return null;
        await row.update(update.$set || update);
        return row;
    };
    Model.findOneAndDelete = async filter => {
        const row = await native.findOne({ where: whereFor(filter || {}) });
        if (row) await row.destroy();
        return row;
    };
    Model.findByIdAndDelete = async id => {
        const rawId = (id && typeof id === 'object') ? (id.id || id._id || id) : id;
        const row = await native.findOne({ where: { id: rawId } });
        if (row) await row.destroy();
        return row;
    };
    Model.deleteMany = filter => Model.destroy({ where: whereFor(filter || {}) });
    Model.aggregate = async (pipelineOrField, funcOrOptions, maybeOptions) => {
        if (typeof pipelineOrField === 'string') {
            return native.aggregate(pipelineOrField, funcOrOptions, maybeOptions);
        }
        const pipeline = Array.isArray(pipelineOrField) ? pipelineOrField : [];
        const group = pipeline.find(x => x.$group);
        if (!group) return [];
        const key = Object.keys(group.$group).find(k => k !== '_id');
        const spec = key && group.$group[key];
        const field = spec && (spec.$sum || '').replace(/^\$/, '');
        const match = pipeline.find(x => x.$match);
        const where = match ? whereFor(match.$match) : {};
        const rows = await Model.findAll({ where, attributes: [field], raw: true });
        return [{ _id: null, [key]: rows.reduce((sum, row) => sum + Number(row[field] || 0), 0) }];
    };
    return Model;
};
[User, Course, Lesson, Question, Enrollment, Progress, Activity, QuizAttempt,
 AdminAuditLog, AdminSettings, Category, Certificate, CertificatePayment].forEach(attachCompat);

module.exports = {
    sequelize,
    User,
    Course,
    Lesson,
    Question,
    Enrollment,
    Progress,
    Activity,
    QuizAttempt,
    AdminAuditLog,
    AdminSettings,
    Category,
    Certificate,
    CertificatePayment
};
