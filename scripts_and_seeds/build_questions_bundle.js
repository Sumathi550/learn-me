const fs = require('fs');
const path = require('path');

const courseFileMap = {
    'python': 'python.json',
    'java': 'java.json',
    'c': 'c.json',
    'cpp': 'c++.json',
    'csharp': 'c#.json',
    'dotnet': 'dot_net.json',
    'javascript': 'js.json',
    'htmlcss': 'html&css.json',
    'react': 'react.json',
    'sql': 'sql.json',
    'dsa': 'dsa.json',
    'mongodb': 'mangodb.json',
    'github': 'GitHub.json',
    'numpy': 'numpy.json',
    'pandas': 'pandas.json',
    'statistics': 'statistics.json',
    'ml': 'ml.json',
    'dl': 'dl.json',
    'cv': 'cv.json',
    'advanced-aptitude': 'advanced-aptitude.json'
};

const dataDir = path.join(__dirname, '..', 'frontend', 'data');
const bank = {};

for (const [courseId, fileName] of Object.entries(courseFileMap)) {
    const filePath = path.join(dataDir, fileName);
    if (!fs.existsSync(filePath)) {
        console.error('File missing:', filePath);
        process.exit(1);
    }
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const formatted = raw.map((item, idx) => {
        const qText = item.q || item.question || `Question ${idx + 1}`;
        const rawOptions = (item.options || item.answers || []).map(opt =>
            typeof opt === 'object' ? (opt.text || opt.label || String(opt)) : String(opt)
        );
        const options = rawOptions.length > 0 ? rawOptions : ['Option A', 'Option B', 'Option C', 'Option D'];
        let answerIdx = 0;
        if (typeof item.answer === 'number') {
            answerIdx = item.answer;
        } else if (typeof item.answer === 'string') {
            const found = options.findIndex(opt => opt.trim() === item.answer.trim());
            answerIdx = found !== -1 ? found : 0;
        }
        return {
            id: idx,
            qId: idx,
            q: qText,
            question: qText,
            options,
            answer: answerIdx,
            explanation: item.explanation || `The correct answer is "${options[answerIdx]}".`
        };
    });
    bank[courseId] = formatted;
    console.log(`${courseId}: ${formatted.length} questions`);
}

const outFile = path.join(__dirname, '..', 'frontend', 'js', 'questions-data.js');
const content = '// Auto-generated 50-question bank for all 20 courses\n' +
    'var COURSE_QUESTIONS_BANK = ' + JSON.stringify(bank, null, 2) + ';\n' +
    'if (typeof window !== "undefined") { window.COURSE_QUESTIONS_BANK = COURSE_QUESTIONS_BANK; }\n' +
    'if (typeof module !== "undefined" && module.exports) { module.exports = COURSE_QUESTIONS_BANK; }\n';

fs.writeFileSync(outFile, content, 'utf8');
console.log('Successfully generated:', outFile);
