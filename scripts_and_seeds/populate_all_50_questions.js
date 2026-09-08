const fs = require('fs');
const path = require('path');
const { Course } = require('../backend/models');
const { connectDB } = require('../backend/config/database');

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

// 1. Generate 50 Aptitude Questions for advanced-aptitude.json if missing
function ensureAptitudeQuestionsFile() {
    const aptFile = path.join(__dirname, '..', 'frontend', 'data', 'advanced-aptitude.json');
    if (fs.existsSync(aptFile)) {
        try {
            const existing = JSON.parse(fs.readFileSync(aptFile, 'utf8'));
            if (Array.isArray(existing) && existing.length >= 50) {
                return;
            }
        } catch(e) {}
    }

    const aptitudeQuestions = [
        // Quantitative Aptitude (1-15)
        { q: "If 12 men can finish a project in 16 days, how many men are required to complete the project in 8 days?", options: ["18", "24", "20", "28"], answer: 1, explanation: "Using M1*D1 = M2*D2: 12 * 16 = M2 * 8, so M2 = 192 / 8 = 24 men." },
        { q: "A train running at 72 km/h crosses a pole in 15 seconds. What is the length of the train?", options: ["300 m", "250 m", "350 m", "200 m"], answer: 0, explanation: "Speed = 72 * (5/18) = 20 m/s. Length = Speed * Time = 20 * 15 = 300 meters." },
        { q: "A shopkeeper sells an item at 20% profit. If the cost price is $250, what is the selling price?", options: ["$280", "$300", "$320", "$310"], answer: 1, explanation: "SP = CP * 1.20 = 250 * 1.20 = $300." },
        { q: "What is the simple interest on $5,000 for 3 years at an annual interest rate of 6%?", options: ["$900", "$850", "$950", "$800"], answer: 0, explanation: "SI = (P * R * T) / 100 = (5000 * 6 * 3) / 100 = $900." },
        { q: "The average of five numbers is 40. If one number is excluded, the average becomes 38. What is the excluded number?", options: ["48", "45", "50", "42"], answer: 0, explanation: "Sum of 5 = 200. Sum of 4 = 152. Excluded number = 200 - 152 = 48." },
        { q: "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, how long will it take to fill the tank?", options: ["12 mins", "15 mins", "10 mins", "14 mins"], answer: 0, explanation: "1/Time = 1/20 + 1/30 = 5/60 = 1/12, so Time = 12 minutes." },
        { q: "If A:B = 2:3 and B:C = 4:5, what is A:B:C?", options: ["8:12:15", "6:9:15", "8:10:15", "6:12:15"], answer: 0, explanation: "Multiply to equalize B: A:B = 8:12, B:C = 12:15, thus A:B:C = 8:12:15." },
        { q: "In how many different ways can the letters of the word 'SMART' be arranged?", options: ["120", "60", "24", "720"], answer: 0, explanation: "5 distinct letters can be arranged in 5! = 5 * 4 * 3 * 2 * 1 = 120 ways." },
        { q: "A bag contains 4 red balls and 6 blue balls. What is the probability of drawing a red ball?", options: ["2/5", "3/5", "1/2", "1/3"], answer: 0, explanation: "Probability = favorable outcomes / total outcomes = 4 / 10 = 2/5." },
        { q: "A sum doubles itself in 5 years under simple interest. What is the annual rate of interest?", options: ["20%", "25%", "15%", "10%"], answer: 0, explanation: "SI = P => P = (P * R * 5) / 100 => R = 100 / 5 = 20%." },
        { q: "What is 35% of 800 minus 25% of 600?", options: ["130", "140", "120", "150"], answer: 0, explanation: "35% of 800 = 280; 25% of 600 = 150; 280 - 150 = 130." },
        { q: "The ratio of present ages of father and son is 7:2. After 5 years, their sum of ages is 55. What is the father's present age?", options: ["35", "40", "42", "28"], answer: 0, explanation: "Present sum = 55 - 10 = 45. Father = (7/9) * 45 = 35 years." },
        { q: "If the perimeter of a rectangle is 60 cm and the length is 20 cm, what is its area?", options: ["200 cm²", "180 cm²", "220 cm²", "240 cm²"], answer: 0, explanation: "Width = (60 / 2) - 20 = 10 cm. Area = 20 * 10 = 200 cm²." },
        { q: "Find the HCF of 36, 54, and 72.", options: ["18", "12", "9", "6"], answer: 0, explanation: "18 divides 36, 54, and 72 without remainder, and is the highest common factor." },
        { q: "A car covers a distance of 300 km in 4 hours. What was its average speed in m/s?", options: ["20.83 m/s", "25 m/s", "18.5 m/s", "22.2 m/s"], answer: 0, explanation: "Speed = 300 / 4 = 75 km/h. In m/s: 75 * (5/18) ≈ 20.83 m/s." },

        // Logical Reasoning (16-30)
        { q: "Complete the series: 3, 7, 15, 31, 63, ?", options: ["127", "125", "129", "131"], answer: 0, explanation: "Each number is multiplied by 2 and added to 1: (63 * 2) + 1 = 127." },
        { q: "If 'CAT' is coded as 24 and 'DOG' is coded as 26, what is 'BIRD' coded as?", options: ["34", "32", "30", "36"], answer: 0, explanation: "Sum of alphabetical positions: B(2) + I(9) + R(18) + D(4) = 33 -> 34." },
        { q: "Pointing to a photograph, a woman says: 'He is the only son of my father's only daughter.' Who is he?", options: ["Her son", "Her brother", "Her father", "Her nephew"], answer: 0, explanation: "Her father's only daughter is the woman herself. Her only son is her son." },
        { q: "Statements: All roses are flowers. Some flowers fade quickly. Conclusions: I. Some roses fade quickly. II. All flowers are roses.", options: ["Neither I nor II follows", "Only I follows", "Only II follows", "Both follow"], answer: 0, explanation: "No definite relationship is given connecting roses directly with fading quickly." },
        { q: "Find the odd one out: Apple, Mango, Carrot, Banana.", options: ["Carrot", "Apple", "Mango", "Banana"], answer: 0, explanation: "Carrot is a root vegetable, whereas the others are fruits." },
        { q: "If South-East becomes North, North-East becomes West, what does West become?", options: ["South-East", "North-West", "South-West", "North"], answer: 0, explanation: "The directions are rotated 135 degrees anti-clockwise. West becomes South-East." },
        { q: "In a certain code, 'ROAD' is written as 'URDG'. How is 'SWAN' written in that code?", options: ["VZDQ", "VZCQ", "UXDQ", "VYDQ"], answer: 0, explanation: "Each letter is shifted forward by 3 positions: S->V, W->Z, A->D, N->Q." },
        { q: "If 1st January 2024 was a Monday, what day was 1st January 2025? (2024 is a leap year)", options: ["Wednesday", "Tuesday", "Thursday", "Sunday"], answer: 0, explanation: "A leap year has 366 days (52 weeks + 2 odd days). Monday + 2 days = Wednesday." },
        { q: "A is taller than B, but shorter than C. D is taller than E but shorter than B. Who is the tallest?", options: ["C", "A", "D", "B"], answer: 0, explanation: "Order from tallest: C > A > B > D > E. C is the tallest." },
        { q: "Which number replaces the question mark? 2, 6, 12, 20, 30, ?", options: ["42", "40", "44", "48"], answer: 0, explanation: "Differences are +4, +6, +8, +10, +12. 30 + 12 = 42." },
        { q: "If '+' means multiply, '-' means divide, '*' means add, then 12 + 4 * 8 - 2 = ?", options: ["52", "48", "56", "44"], answer: 0, explanation: "12 * 4 + 8 / 2 = 48 + 4 = 52." },
        { q: "Statement: Should high school curriculum include mandatory financial literacy? Argument I: Yes, students learn personal money management early. Argument II: No, it increases the study burden.", options: ["Only argument I is strong", "Only argument II is strong", "Both are strong", "Neither is strong"], answer: 0, explanation: "Argument I addresses a fundamental practical life skill, which is strong and constructive." },
        { q: "Select the related pair: Book : Reading :: Fork : ?", options: ["Eating", "Writing", "Cooking", "Cleaning"], answer: 0, explanation: "A book is an instrument for reading; a fork is an instrument for eating." },
        { q: "Find the missing term: AZ, BY, CX, ?", options: ["DW", "DV", "EV", "DX"], answer: 0, explanation: "First letter progresses A, B, C, D; second letter goes backwards Z, Y, X, W." },
        { q: "Six people P, Q, R, S, T, U sit around a circular table. P is opposite S. R is to the immediate right of P. Where is R sitting relative to S?", options: ["Second to the left of S", "Opposite to S", "Adjacent to S", "Second to the right of S"], answer: 0, explanation: "Circular geometry places R directly second to the left of S." },

        // Data Interpretation (31-40)
        { q: "A company's revenue grew from $20M to $25M in one year. What is the percentage increase?", options: ["25%", "20%", "30%", "15%"], answer: 0, explanation: "Increase = ($25M - $20M) / $20M = 5 / 20 = 25%." },
        { q: "In a pie chart, if the sector for 'Marketing' represents 72 degrees, what percentage of the total budget does it represent?", options: ["20%", "25%", "15%", "18%"], answer: 0, explanation: "(72° / 360°) * 100% = 20%." },
        { q: "A team produced 500 units on Monday, 600 on Tuesday, 700 on Wednesday, and 600 on Thursday. What is the average daily output?", options: ["600 units", "650 units", "580 units", "620 units"], answer: 0, explanation: "Total = 2400 units over 4 days = 2400 / 4 = 600 units." },
        { q: "If Company A produces 40% of the market output and Company B produces 30%, what is the ratio of their production?", options: ["4:3", "3:4", "5:4", "2:1"], answer: 0, explanation: "Ratio = 40% : 30% = 4:3." },
        { q: "In an exam, 80 students passed and 20 failed. What percentage of total candidates passed?", options: ["80%", "75%", "85%", "70%"], answer: 0, explanation: "Total = 100 students. Pass rate = (80 / 100) * 100 = 80%." },
        { q: "If monthly expenditure is $1,200 and savings are $800, what fraction of total income is saved?", options: ["2/5", "3/5", "1/2", "1/4"], answer: 0, explanation: "Total Income = $2,000. Fraction = 800 / 2000 = 2/5." },
        { q: "The median of the dataset [12, 18, 22, 25, 30, 35, 40] is:", options: ["25", "22", "30", "26"], answer: 0, explanation: "The dataset has 7 values in ascending order; the middle 4th item is 25." },
        { q: "A bar chart shows sales of 100 in Q1 and 150 in Q2. By what factor did sales grow?", options: ["1.5x", "1.25x", "2.0x", "1.75x"], answer: 0, explanation: "Growth factor = 150 / 100 = 1.5x." },
        { q: "If the standard deviation of a dataset is 4, what is its variance?", options: ["16", "8", "2", "64"], answer: 0, explanation: "Variance = (Standard Deviation)² = 4² = 16." },
        { q: "What does the interquartile range (IQR) measure in data analysis?", options: ["Spread of the middle 50% of data", "The overall mean", "The maximum range", "The frequency count"], answer: 0, explanation: "IQR = Q3 - Q1, which represents the spread of the middle 50% of values." },

        // Verbal Ability (41-50)
        { q: "Choose the synonym for 'METICULOUS':", options: ["Precise and thorough", "Careless", "Quick", "Indifferent"], answer: 0, explanation: "'Meticulous' means taking extreme care and showing great attention to detail." },
        { q: "Choose the antonym for 'CANDID':", options: ["Deceptive", "Honest", "Direct", "Sincere"], answer: 0, explanation: "'Candid' means frank and outspoken; its antonym is deceptive or guarded." },
        { q: "Identify the correctly spelled word:", options: ["Entrepreneur", "Enterpreneur", "Entreprenure", "Entrepraneur"], answer: 0, explanation: "The correct spelling is 'Entrepreneur'." },
        { q: "Fill in the blank: The board of directors _____ agreed to the merger proposal.", options: ["unanimously", "unanimous", "unanimity", "unanimousness"], answer: 0, explanation: "The adverb 'unanimously' correctly modifies the verb 'agreed'." },
        { q: "What does the idiom 'Bite the bullet' mean?", options: ["Face a tough situation bravely", "Fire a weapon", "Avoid confrontation", "Give up completely"], answer: 0, explanation: "'Bite the bullet' means enduring a painful or difficult situation with courage." },
        { q: "Select the sentence with correct subject-verb agreement:", options: ["Neither of the candidates has arrived yet.", "Neither of the candidates have arrived yet.", "Neither candidates is here.", "Neither of them are ready."], answer: 0, explanation: "'Neither' is a singular indefinite pronoun requiring the singular verb 'has arrived'." },
        { q: "Choose the word closest in meaning to 'EPHEMERAL':", options: ["Short-lived", "Permanent", "Magnificent", "Complex"], answer: 0, explanation: "'Ephemeral' describes something that lasts for only a very short time." },
        { q: "Select the one-word substitute: 'A person who speaks many languages'", options: ["Polyglot", "Monoglot", "Linguist", "Philologist"], answer: 0, explanation: "A 'Polyglot' is a person who knows and is able to use several languages." },
        { q: "Identify the figure of speech in: 'The classroom was a zoo during recess.'", options: ["Metaphor", "Simile", "Personification", "Hyperbole"], answer: 0, explanation: "It makes a direct comparison without using 'like' or 'as', which defines a metaphor." },
        { q: "Fill in the blank: She has been working at this institution _____ 2018.", options: ["since", "for", "from", "during"], answer: 0, explanation: "'Since' is used to denote a specific starting point in time in the past." }
    ];

    fs.writeFileSync(aptFile, JSON.stringify(aptitudeQuestions, null, 2), 'utf8');
    console.log(`Created ${aptFile} with ${aptitudeQuestions.length} questions.`);
}

async function updateAllCoursesTo50Questions() {
    ensureAptitudeQuestionsFile();
    await connectDB();

    console.log('--- Checking & Updating All Course Questions to 50 ---');
    const courses = await Course.findAll();
    const dataDir = path.join(__dirname, '..', 'frontend', 'data');

    for (const course of courses) {
        const file = courseFileMap[course.courseId];
        if (!file) {
            console.log(`Skipping unknown courseId: ${course.courseId}`);
            continue;
        }

        const filePath = path.join(dataDir, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }

        try {
            const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!Array.isArray(rawData)) {
                console.warn(`File ${file} does not contain an array`);
                continue;
            }

            const formattedQuestions = rawData.map((item, idx) => {
                const qText = item.q || item.question || `Question ${idx + 1}`;
                const rawOptions = (item.options || item.answers || []).map(opt =>
                    typeof opt === 'object' ? (opt.text || opt.label || String(opt)) : String(opt)
                );
                const options = rawOptions.length > 0 ? rawOptions : ["Option A", "Option B", "Option C", "Option D"];

                let answerIdx = 0;
                if (typeof item.answer === 'number') {
                    answerIdx = item.answer;
                } else if (typeof item.answer === 'string') {
                    const found = options.findIndex(opt => opt.trim() === item.answer.trim());
                    answerIdx = found !== -1 ? found : 0;
                }

                return {
                    q: qText,
                    question: qText,
                    options,
                    answer: answerIdx,
                    explanation: item.explanation || `The correct answer is "${options[answerIdx]}".`
                };
            });

            course.questions = formattedQuestions;
            course.questionsUrl = `data/${file}`;
            await course.save();
            console.log(`SUCCESS: Course "${course.title}" (${course.courseId}) updated with ${formattedQuestions.length} questions.`);
        } catch (e) {
            console.error(`ERROR updating course ${course.courseId}:`, e.message);
        }
    }

    console.log('\n--- Final Verification from Database ---');
    const updatedCourses = await Course.findAll({ raw: true });
    const summary = updatedCourses.map(c => {
        let qCount = 0;
        try {
            const parsed = typeof c.questions === 'string' ? JSON.parse(c.questions) : c.questions;
            qCount = Array.isArray(parsed) ? parsed.length : 0;
        } catch(e) {}
        return { courseId: c.courseId, title: c.title, questionsInDb: qCount };
    });
    console.table(summary);
    process.exit(0);
}

updateAllCoursesTo50Questions().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
