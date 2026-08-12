// ===============================
// DATA & STATE MANAGEMENT
// ===============================

const coursesData = [
    { id: "python",     title: "Python Programming",      subtitle: "Master Python fundamentals, data structures, and automation.",                          icon: "fa-python",        duration: "10 hrs", difficulty: "Beginner",      questionsUrl: "python.json"     },
    { id: "numpy",      title: "NumPy",                   subtitle: "Numerical computing with powerful N-dimensional arrays.",                              icon: "fa-table",         duration: "5 hrs",  difficulty: "Intermediate",  questionsUrl: "numpy.Json"      },
    { id: "pandas",     title: "Pandas",                  subtitle: "Data analysis and manipulation made easy.",                                            icon: "fa-database",      duration: "7 hrs",  difficulty: "Intermediate",  questionsUrl: "pandas.json"     },
    { id: "statistics", title: "Statistics for ML",       subtitle: "Core statistical concepts necessary for Data Science and Machine Learning.",           icon: "fa-chart-bar",     duration: "8 hrs",  difficulty: "Beginner",      questionsUrl: "statistics.json" },
    { id: "ml",         title: "Machine Learning (ML)",   subtitle: "Train supervised and unsupervised learning models using Scikit-Learn.",                icon: "fa-brain",         duration: "12 hrs", difficulty: "Intermediate",  questionsUrl: "ml.json"         },
    { id: "dl",         title: "Deep Learning (DL)",      subtitle: "Build neural networks and understand deep architectures.",                             icon: "fa-network-wired", duration: "15 hrs", difficulty: "Advanced",      questionsUrl: "dl.json"         },
    { id: "cv",         title: "Computer Vision (CV)",    subtitle: "Image processing and computer vision techniques with AI.",                             icon: "fa-eye",           duration: "14 hrs", difficulty: "Advanced",      questionsUrl: "cv.json"         }
];

// App State
let appState = {
    currentView: 'home',
    currentCourseId: null,
    currentAssessment: null,
    progress: {},        // { "python": { score: 85, passed: true, answers: {}, reviewData: [] } }
    studentName: ''
};

// ===============================
// INIT & LOCAL STORAGE
// ===============================

async function initApp() {
    loadProgress();
    setupNavigation();
    await loadExternalQuestions();
    seedMockQuestions();
    renderCourses();
    navigateTo('home');
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('learnMeProgress_v2');
        if (saved) appState.progress = JSON.parse(saved);
        const name = localStorage.getItem('learnMeStudentName');
        if (name) appState.studentName = name;
    } catch(e) {
        appState.progress = {};
    }
}

function saveProgress() {
    localStorage.setItem('learnMeProgress_v2', JSON.stringify(appState.progress));
}

function saveStudentName(name) {
    appState.studentName = name.trim();
    localStorage.setItem('learnMeStudentName', appState.studentName);
}

// ===============================
// QUESTION LOADING — Embedded Data
// (works on file:// and any server, no fetch needed)
// ===============================

const EMBEDDED_QUESTIONS = {
    python: [
        { q: "Which keyword is used to define a function in Python?", options: ["function","define","def","func"], answer: 2 },
        { q: "Which function is used to display output in Python?", options: ["echo()","display()","print()","show()"], answer: 2 },
        { q: "Which function is used to get input from the user?", options: ["read()","scan()","input()","get()"], answer: 2 },
        { q: "Which data type is used to store whole numbers?", options: ["float","int","str","bool"], answer: 1 },
        { q: "Which is the correct file extension for Python files?", options: [".pt",".python",".py",".pyt"], answer: 2 },
        { q: "Which operator is used for exponentiation in Python?", options: ["^","**","*","%"], answer: 1 },
        { q: "Which symbol is used to write a comment in Python?", options: ["//","#","/*","--"], answer: 1 },
        { q: "Which of the following is a mutable data type?", options: ["Tuple","String","List","Integer"], answer: 2 },
        { q: "Which keyword creates a loop that repeats while a condition is true?", options: ["for","repeat","while","loop"], answer: 2 },
        { q: "Which keyword is used to import a module in Python?", options: ["include","using","import","require"], answer: 2 },
        { q: "Which operator is used for floor division in Python?", options: ["/","//","%","**"], answer: 1 },
        { q: "Which operator is used to find the remainder of a division?", options: ["/","//","%","*"], answer: 2 },
        { q: "Which comparison operator checks if two values are equal?", options: ["=","==","!=",">="], answer: 1 },
        { q: "Which logical operator returns True only if both conditions are True?", options: ["or","and","not","xor"], answer: 1 },
        { q: "Which keyword starts a conditional statement in Python?", options: ["when","if","switch","case"], answer: 1 },
        { q: "Which keyword checks another condition if the first is False?", options: ["elseif","elif","else if","otherwise"], answer: 1 },
        { q: "Which keyword executes when all previous conditions are False?", options: ["default","finally","else","break"], answer: 2 },
        { q: "Which comparison operator means 'not equal to'?", options: ["<>","!=","==","=!"], answer: 1 },
        { q: "What is the output of: print(10 > 5)?", options: ["False","10","True","Error"], answer: 2 },
        { q: "Which logical operator reverses a Boolean value?", options: ["and","or","not","is"], answer: 2 },
        { q: "Which loop is used to iterate over a sequence in Python?", options: ["while","for","loop","repeat"], answer: 1 },
        { q: "Which keyword terminates a loop immediately?", options: ["continue","stop","break","exit"], answer: 2 },
        { q: "Which keyword skips the current iteration and moves to the next?", options: ["break","pass","continue","skip"], answer: 2 },
        { q: "What is the output of range(5)?", options: ["1,2,3,4,5","0,1,2,3,4","0,1,2,3,4,5","1,2,3,4"], answer: 1 },
        { q: "Which loop executes as long as the given condition is True?", options: ["for","while","repeat","do-while"], answer: 1 },
        { q: "Which keyword is used to return a value from a function?", options: ["print","return","yield","break"], answer: 1 },
        { q: "Which function returns the length of a list or string?", options: ["count()","size()","len()","length()"], answer: 2 },
        { q: "Which keyword is used to create an anonymous function?", options: ["lambda","anonymous","func","def"], answer: 0 },
        { q: "Which method adds an element to the end of a list?", options: ["insert()","append()","add()","extend()"], answer: 1 },
        { q: "Which method removes the last element from a list?", options: ["remove()","delete()","pop()","clear()"], answer: 2 },
        { q: "Which brackets are used to create a list in Python?", options: ["()","[]","{}","<>"], answer: 1 },
        { q: "Which data structure is immutable in Python?", options: ["List","Dictionary","Tuple","Set"], answer: 2 },
        { q: "Which collection stores data as key-value pairs?", options: ["List","Tuple","Dictionary","Set"], answer: 2 },
        { q: "Which method returns all the keys in a dictionary?", options: ["values()","items()","keys()","get()"], answer: 2 },
        { q: "Which method removes all elements from a list?", options: ["delete()","remove()","clear()","pop()"], answer: 2 },
        { q: "Which Python collection automatically removes duplicate values?", options: ["List","Tuple","Set","Dictionary"], answer: 2 },
        { q: "Which method sorts a list in ascending order?", options: ["order()","arrange()","sort()","sortedlist()"], answer: 2 },
        { q: "Which brackets are used to create a dictionary?", options: ["[]","()","{}","<>"], answer: 2 },
        { q: "Which is the correct way to call a function named 'display'?", options: ["display","display[]","display()","call display()"], answer: 2 },
        { q: "Which Python set operation returns elements in both sets?", options: ["union()","intersection()","difference()","symmetric_difference()"], answer: 1 }
    ],
    numpy: [
        { q: "What is NumPy primarily used for?", options: ["Web Development","Numerical Computing","Game Development","Networking"], answer: 1 },
        { q: "Which statement is used to import NumPy?", options: ["import numpy","import numpy as np","include numpy","using numpy"], answer: 1 },
        { q: "Which function is used to create a NumPy array?", options: ["np.create()","np.array()","np.list()","np.make()"], answer: 1 },
        { q: "What is the type of a NumPy array?", options: ["list","tuple","numpy.ndarray","dict"], answer: 2 },
        { q: "Which attribute returns the shape of a NumPy array?", options: ["size","shape","length","ndim"], answer: 1 },
        { q: "Which attribute returns the number of dimensions?", options: ["shape","size","ndim","dtype"], answer: 2 },
        { q: "Which attribute returns the total number of elements?", options: ["count","shape","size","length"], answer: 2 },
        { q: "Which attribute returns the data type of array elements?", options: ["dtype","type","datatype","class"], answer: 0 },
        { q: "Why are NumPy arrays preferred over Python lists for numerical computations?", options: ["They use less memory and are faster","They support only strings","They cannot perform math operations","They are slower but easier"], answer: 0 },
        { q: "Which function converts a Python list into a NumPy array?", options: ["np.convert()","np.array()","np.tolist()","np.change()"], answer: 1 },
        { q: "Which function creates an array filled with zeros?", options: ["np.ones()","np.zeros()","np.empty()","np.full()"], answer: 1 },
        { q: "Which function creates an array filled with ones?", options: ["np.ones()","np.zeros()","np.empty()","np.identity()"], answer: 0 },
        { q: "Which function creates an identity matrix?", options: ["np.diag()","np.identity()","np.zeros()","np.full()"], answer: 1 },
        { q: "Which function creates evenly spaced values over an interval?", options: ["np.arange()","np.linspace()","np.range()","np.random()"], answer: 1 },
        { q: "Which NumPy function is similar to Python's range()?", options: ["np.arange()","np.linspace()","np.interval()","np.count()"], answer: 0 },
        { q: "Which function creates an array with random values between 0 and 1?", options: ["np.random.rand()","np.random.randint()","np.random.randomint()","np.random.choice()"], answer: 0 },
        { q: "Which function generates random integers?", options: ["np.randint()","np.random.randint()","np.random.int()","np.int()"], answer: 1 },
        { q: "Which function creates an array without initializing its values?", options: ["np.empty()","np.zeros()","np.ones()","np.full()"], answer: 0 },
        { q: "Which function creates an array filled with a specified value?", options: ["np.fill()","np.full()","np.value()","np.assign()"], answer: 1 },
        { q: "Which method changes the shape of an existing NumPy array?", options: ["resize()","reshape()","changeShape()","modify()"], answer: 1 },
        { q: "Which operator performs element-wise addition of two NumPy arrays?", options: ["+","&","*","%"], answer: 0 },
        { q: "Which function returns the sum of all elements in a NumPy array?", options: ["np.add()","np.sum()","np.total()","np.count()"], answer: 1 },
        { q: "Which function returns the average (mean) of array elements?", options: ["np.avg()","np.average()","np.mean()","np.mid()"], answer: 2 },
        { q: "Which function returns the largest value in a NumPy array?", options: ["np.high()","np.maximum()","np.max()","np.large()"], answer: 2 },
        { q: "Which function returns the smallest value in a NumPy array?", options: ["np.minimum()","np.low()","np.small()","np.min()"], answer: 3 },
        { q: "Which function calculates the square root of each element?", options: ["np.square()","np.root()","np.sqrt()","np.power()"], answer: 2 },
        { q: "Which function raises each element to a specified power?", options: ["np.exp()","np.power()","np.raise()","np.squareRoot()"], answer: 1 },
        { q: "Which function performs matrix multiplication (dot product)?", options: ["np.multiply()","np.cross()","np.dot()","np.matmulArray()"], answer: 2 },
        { q: "What is broadcasting in NumPy?", options: ["Sending arrays over a network","Expanding arrays of different shapes to perform operations","Sorting array elements","Creating multiple arrays at once"], answer: 1 },
        { q: "In NumPy, array indexing starts from?", options: ["1","0","-1","Depends on the array"], answer: 1 },
        { q: "Which index refers to the last element of a NumPy array?", options: ["0","-1","1","last"], answer: 1 },
        { q: "Which symbol is used for slicing in NumPy?", options: [":",";",",","|"], answer: 0 },
        { q: "What does arr[2:5] return?", options: ["Elements at index 2, 3, and 4","Elements at index 2 to 5 inclusive","Elements at index 3, 4, and 5","An error"], answer: 0 },
        { q: "Which attribute is used to transpose a NumPy array?", options: [".shape",".T",".dtype",".size"], answer: 1 },
        { q: "Which function joins multiple NumPy arrays into one?", options: ["np.append()","np.concatenate()","np.combine()","np.connect()"], answer: 1 },
        { q: "Which function splits a NumPy array into multiple sub-arrays?", options: ["np.divide()","np.cut()","np.split()","np.slice()"], answer: 2 },
        { q: "Which function calculates the standard deviation?", options: ["np.var()","np.std()","np.mean()","np.sum()"], answer: 1 },
        { q: "Which function calculates the variance?", options: ["np.var()","np.std()","np.mean()","np.average()"], answer: 0 },
        { q: "Which function returns only the unique elements from a NumPy array?", options: ["np.unique()","np.single()","np.remove()","np.filter()"], answer: 0 },
        { q: "Which operator is commonly used for matrix multiplication in NumPy?", options: ["*","@","%","//"], answer: 1 }
    ],
    pandas: [
        { q: "What is Pandas primarily used for?", options: ["Game Development","Data Analysis and Manipulation","Web Development","Networking"], answer: 1 },
        { q: "Which statement is used to import Pandas?", options: ["import pandas","import pandas as pd","include pandas","using pandas"], answer: 1 },
        { q: "Which Pandas data structure is one-dimensional?", options: ["DataFrame","Series","Array","Table"], answer: 1 },
        { q: "Which Pandas data structure is two-dimensional?", options: ["Series","List","DataFrame","Tuple"], answer: 2 },
        { q: "Which function creates a Pandas Series?", options: ["pd.DataFrame()","pd.Series()","pd.Array()","pd.List()"], answer: 1 },
        { q: "Which function creates a Pandas DataFrame?", options: ["pd.Table()","pd.Series()","pd.DataFrame()","pd.Frame()"], answer: 2 },
        { q: "Which attribute returns the dimensions of a DataFrame?", options: ["shape","size","count","length"], answer: 0 },
        { q: "Which function displays the first 5 rows of a DataFrame?", options: ["tail()","show()","head()","display()"], answer: 2 },
        { q: "Which function displays the last 5 rows of a DataFrame?", options: ["head()","last()","tail()","bottom()"], answer: 2 },
        { q: "Which function provides a summary including column names and data types?", options: ["describe()","summary()","info()","details()"], answer: 2 },
        { q: "Which function is used to read a CSV file in Pandas?", options: ["pd.open_csv()","pd.read_csv()","pd.load_csv()","pd.import_csv()"], answer: 1 },
        { q: "Which function is used to read an Excel file?", options: ["pd.read_excel()","pd.open_excel()","pd.load_excel()","pd.import_excel()"], answer: 0 },
        { q: "Which function saves a DataFrame as a CSV file?", options: ["to_csv()","save_csv()","write_csv()","export_csv()"], answer: 0 },
        { q: "Which function is used to read a JSON file in Pandas?", options: ["pd.read_json()","pd.open_json()","pd.import_json()","pd.load_json()"], answer: 0 },
        { q: "Which attribute selects rows and columns by label?", options: ["iloc[]","loc[]","select[]","index[]"], answer: 1 },
        { q: "Which attribute selects rows and columns by integer position?", options: ["loc[]","iloc[]","position[]","rows[]"], answer: 1 },
        { q: "Which syntax selects a single column from a DataFrame?", options: ["df(column)","df['column']","df.column()","df->column"], answer: 1 },
        { q: "Which function returns all unique values in a column?", options: ["distinct()","unique()","different()","values()"], answer: 1 },
        { q: "Which function returns the frequency of unique values?", options: ["count_values()","value_counts()","frequency()","unique_count()"], answer: 1 },
        { q: "Which function sorts a DataFrame by column values?", options: ["sort()","sort_values()","arrange()","order()"], answer: 1 },
        { q: "Which function removes rows or columns from a DataFrame?", options: ["remove()","delete()","drop()","clear()"], answer: 2 },
        { q: "Which function removes rows containing missing values?", options: ["dropna()","fillna()","removeNull()","clean()"], answer: 0 },
        { q: "Which function replaces missing values with a specified value?", options: ["replace()","fillna()","update()","insert()"], answer: 1 },
        { q: "Which function renames DataFrame columns?", options: ["change()","rename()","modify()","setName()"], answer: 1 },
        { q: "Which function changes the data type of a column?", options: ["convert()","astype()","dtype()","cast()"], answer: 1 },
        { q: "Which function removes duplicate rows from a DataFrame?", options: ["drop_duplicates()","remove_duplicates()","unique()","distinct()"], answer: 0 },
        { q: "Which function checks for missing values in a DataFrame?", options: ["isna()","isempty()","checknull()","findnull()"], answer: 0 },
        { q: "Which expression counts missing values in each column?", options: ["df.isna().sum()","df.count()","df.total()","df.nullcount()"], answer: 0 },
        { q: "Which function groups data by one or more columns?", options: ["group()","groupby()","cluster()","categorize()"], answer: 1 },
        { q: "Which function merges two DataFrames on a common column?", options: ["combine()","concat()","merge()","joinData()"], answer: 2 },
        { q: "Which function concatenates multiple DataFrames?", options: ["append()","merge()","concat()","join()"], answer: 2 },
        { q: "Which function generates summary statistics for numerical columns?", options: ["summary()","describe()","statistics()","info()"], answer: 1 },
        { q: "Which function calculates the average of a column?", options: ["average()","mean()","median()","mode()"], answer: 1 },
        { q: "Which function returns the middle value of a dataset?", options: ["mode()","mean()","median()","center()"], answer: 2 },
        { q: "Which function returns the most frequently occurring value?", options: ["mode()","median()","mean()","count()"], answer: 0 },
        { q: "Which function calculates the correlation between numerical columns?", options: ["cov()","corr()","relationship()","compare()"], answer: 1 },
        { q: "Which aggregation function counts the number of non-null values?", options: ["size()","count()","sum()","total()"], answer: 1 },
        { q: "Which parameter prevents the index column from being saved in a CSV?", options: ["header=False","index=False","save=False","row=False"], answer: 1 },
        { q: "What is the default separator used by read_csv()?", options: ["Semicolon (;)","Comma (,)","Tab (\\t)","Space"], answer: 1 },
        { q: "Which expression selects rows where Age > 18?", options: ["df[df['Age'] > 18]","df.select(Age>18)","df.where(Age>18)","df.filter(Age>18)"], answer: 0 }
    ],
    statistics: [
        { q: "What is Statistics primarily used for in Machine Learning?", options: ["Web Development","Data Analysis and Decision Making","Game Development","Networking"], answer: 1 },
        { q: "Which of the following is a type of statistics?", options: ["Descriptive Statistics","Inferential Statistics","Both A and B","None of the above"], answer: 2 },
        { q: "What does Descriptive Statistics mainly do?", options: ["Predict future values","Summarize and describe data","Train ML models","Store data"], answer: 1 },
        { q: "Which measure represents the average value of a dataset?", options: ["Median","Mode","Mean","Range"], answer: 2 },
        { q: "Which measure represents the middle value in an ordered dataset?", options: ["Mean","Median","Mode","Variance"], answer: 1 },
        { q: "Which measure represents the most frequently occurring value?", options: ["Mean","Median","Mode","Range"], answer: 2 },
        { q: "Which measure is calculated as Maximum Value - Minimum Value?", options: ["Variance","Range","Standard Deviation","Mean"], answer: 1 },
        { q: "Which measure indicates how spread out data is from the mean?", options: ["Mode","Variance","Median","Frequency"], answer: 1 },
        { q: "Which measure is the square root of variance?", options: ["Mean","Median","Standard Deviation","Range"], answer: 2 },
        { q: "Which type of statistics makes predictions about a population from sample data?", options: ["Descriptive","Inferential","Summary","Predictive"], answer: 1 },
        { q: "What is probability?", options: ["The measure of certainty of an event","The measure of the likelihood of an event occurring","The total number of outcomes","The average of a dataset"], answer: 1 },
        { q: "What is the probability value of an impossible event?", options: ["0","0.5","1","-1"], answer: 0 },
        { q: "What is the probability value of a certain event?", options: ["0","0.25","0.5","1"], answer: 3 },
        { q: "If a fair coin is tossed, what is the probability of getting Heads?", options: ["0","0.25","0.5","1"], answer: 2 },
        { q: "What is the probability of rolling a 6 on a fair six-sided dice?", options: ["1/2","1/3","1/6","1/12"], answer: 2 },
        { q: "Which theorem updates probabilities based on new evidence?", options: ["Pythagoras Theorem","Bayes Theorem","Euler Theorem","Fermat Theorem"], answer: 1 },
        { q: "What is the probability of selecting an even number from {1,2,3,4,5,6}?", options: ["1/2","1/3","2/3","1/6"], answer: 0 },
        { q: "Which distribution is also known as the Gaussian Distribution?", options: ["Uniform","Normal","Binomial","Poisson"], answer: 1 },
        { q: "What is the shape of a normal distribution curve?", options: ["Rectangular","Bell-shaped","Triangular","Circular"], answer: 1 },
        { q: "What does a histogram primarily represent?", options: ["Relationship between two variables","Frequency distribution of data","Average value","Data correlation"], answer: 1 },
        { q: "Which measure indicates whether a distribution is symmetric or asymmetric?", options: ["Variance","Skewness","Range","Mode"], answer: 1 },
        { q: "A positively skewed distribution has a tail extending towards which side?", options: ["Left","Right","Both sides","No tail"], answer: 1 },
        { q: "What does kurtosis measure?", options: ["Spread of data","Center of data","Peakedness of a distribution","Correlation"], answer: 2 },
        { q: "Which statistical measure is commonly used to detect outliers?", options: ["Z-Score","Mean","Median","Mode"], answer: 0 },
        { q: "What does a Z-score represent?", options: ["The maximum value","The minimum value","The number of standard deviations from the mean","The average value"], answer: 2 },
        { q: "Which measure divides a dataset into four equal parts?", options: ["Percentiles","Quartiles","Deciles","Mean"], answer: 1 },
        { q: "What does the Null Hypothesis (H₀) represent?", options: ["There is a significant effect","There is no significant effect or difference","The experiment failed","The sample is invalid"], answer: 1 },
        { q: "What does the Alternative Hypothesis (H₁) represent?", options: ["No relationship exists","There is a significant effect or difference","The sample size is small","The experiment should stop"], answer: 1 },
        { q: "What is a p-value?", options: ["The probability of obtaining the observed result assuming H₀ is true","The average of the dataset","The confidence level","The standard deviation"], answer: 0 },
        { q: "What is the commonly used significance level (α)?", options: ["0.5","0.1","0.05","1.0"], answer: 2 },
        { q: "If the p-value < α, you should:", options: ["Accept the null hypothesis","Reject the null hypothesis","Ignore the result","Increase the sample size"], answer: 1 },
        { q: "A Type I Error occurs when:", options: ["A true null hypothesis is rejected","A false null hypothesis is accepted","The sample is too small","The test statistic is zero"], answer: 0 },
        { q: "A Type II Error occurs when:", options: ["A false null hypothesis is accepted","A true null hypothesis is rejected","The p-value is zero","The sample size is very large"], answer: 0 },
        { q: "Which statistical test compares the means of two groups?", options: ["Chi-Square Test","t-Test","Correlation Test","Regression Test"], answer: 1 },
        { q: "Which test determines relationships between categorical variables?", options: ["t-Test","ANOVA","Chi-Square Test","Z-Test"], answer: 2 },
        { q: "Which test compares the means of three or more groups?", options: ["t-Test","Chi-Square Test","ANOVA","Z-Test"], answer: 2 },
        { q: "What does correlation measure?", options: ["The average of a dataset","The relationship between two variables","The spread of data","The probability of an event"], answer: 1 },
        { q: "Which correlation value indicates a perfect positive relationship?", options: ["-1","0","0.5","1"], answer: 3 },
        { q: "Which correlation value indicates no linear relationship?", options: ["0","1","-1","0.9"], answer: 0 },
        { q: "Which method calculates linear correlation between two numerical variables?", options: ["Pearson Correlation","Bayes Theorem","ANOVA","Chi-Square Test"], answer: 0 }
    ],
    ml: [
        { q: "What is Machine Learning?", options: ["A programming language","A branch of AI that enables computers to learn from data","A database system","A web framework"], answer: 1 },
        { q: "Which is NOT a type of Machine Learning?", options: ["Supervised Learning","Unsupervised Learning","Reinforcement Learning","Compiled Learning"], answer: 3 },
        { q: "Which library is commonly used for Machine Learning in Python?", options: ["NumPy","Pandas","Scikit-learn","Matplotlib"], answer: 2 },
        { q: "What is a feature in Machine Learning?", options: ["The output value","An input variable used for prediction","A graph","A model"], answer: 1 },
        { q: "What is a label in supervised learning?", options: ["The input feature","The target or output value","The dataset name","The algorithm"], answer: 1 },
        { q: "Which stage comes first in a ML project?", options: ["Model Evaluation","Data Collection","Model Deployment","Prediction"], answer: 1 },
        { q: "Which is a real-world application of ML?", options: ["Spam Email Detection","Movie Recommendation","Face Recognition","All of the above"], answer: 3 },
        { q: "What is Supervised Learning?", options: ["Learning without labeled data","Learning using labeled data","Learning using robots","Learning without training"], answer: 1 },
        { q: "Which is a Supervised Learning task?", options: ["Clustering","Dimensionality Reduction","Classification","Association Rule Mining"], answer: 2 },
        { q: "Which Supervised Learning task predicts continuous values?", options: ["Classification","Regression","Clustering","Association"], answer: 1 },
        { q: "Which algorithm predicts house prices?", options: ["K-Means","Linear Regression","Apriori","PCA"], answer: 1 },
        { q: "Which algorithm is commonly used for binary classification?", options: ["Logistic Regression","K-Means","DBSCAN","PCA"], answer: 0 },
        { q: "Which Scikit-learn function splits data into training and testing sets?", options: ["split_data()","train_test_split()","divide_dataset()","random_split()"], answer: 1 },
        { q: "What is Overfitting in ML?", options: ["Model performs well on training but poorly on new data","Model performs poorly on both","Model ignores training data","Model has fewer features"], answer: 0 },
        { q: "What is Underfitting in ML?", options: ["Model learns training data perfectly","Model is too simple to learn the underlying pattern","Model memorizes the dataset","Model performs perfectly on all datasets"], answer: 1 },
        { q: "What is Unsupervised Learning?", options: ["Learning using labeled data","Learning without labeled data","Learning using reinforcement signals","Learning only from images"], answer: 1 },
        { q: "Which is an Unsupervised Learning task?", options: ["Regression","Classification","Clustering","Prediction"], answer: 2 },
        { q: "Which algorithm is commonly used for clustering?", options: ["Linear Regression","Logistic Regression","K-Means","Decision Tree"], answer: 2 },
        { q: "What does PCA stand for?", options: ["Primary Component Analysis","Principal Component Analysis","Parallel Component Analysis","Predictive Component Algorithm"], answer: 1 },
        { q: "What is the purpose of PCA?", options: ["Increase number of features","Reduce dimensionality while preserving important information","Perform classification","Train neural networks"], answer: 1 },
        { q: "Which method determines the optimal number of clusters in K-Means?", options: ["Accuracy Score","Elbow Method","Precision","Recall"], answer: 1 },
        { q: "Which metric measures the overall correctness of a classification model?", options: ["Precision","Recall","Accuracy","F1-Score"], answer: 2 },
        { q: "Which metric combines Precision and Recall?", options: ["Accuracy","Mean Squared Error","F1-Score","ROC Curve"], answer: 2 },
        { q: "Which table summarizes the performance of a classification model?", options: ["Pivot Table","Confusion Matrix","Frequency Table","Summary Table"], answer: 1 },
        { q: "What is Cross Validation mainly used for?", options: ["Reduce dataset size","Evaluate model performance on different splits","Increase features","Remove duplicates"], answer: 1 },
        { q: "Which preprocessing technique scales values to 0–1?", options: ["Standardization","Normalization","Encoding","Sampling"], answer: 1 },
        { q: "Which preprocessing technique gives mean=0 and std=1?", options: ["Normalization","Standardization","Tokenization","Clustering"], answer: 1 },
        { q: "Which ML algorithm uses a tree structure for classification and regression?", options: ["Decision Tree","K-Means","PCA","Naive Bayes"], answer: 0 },
        { q: "Which algorithm combines multiple decision trees?", options: ["Linear Regression","Random Forest","KNN","DBSCAN"], answer: 1 },
        { q: "What does SVM stand for?", options: ["Support Vector Machine","Simple Vector Model","Statistical Variable Method","System Vector Mapping"], answer: 0 },
        { q: "Which algorithm classifies based on nearest neighbors?", options: ["K-Nearest Neighbors (KNN)","Naive Bayes","Random Forest","Linear Regression"], answer: 0 },
        { q: "Which algorithm is based on Bayes' Theorem?", options: ["Decision Tree","Naive Bayes","K-Means","Logistic Regression"], answer: 1 },
        { q: "Which boosting algorithm is widely used for high-performance ML?", options: ["Gradient Boosting","KNN","PCA","Apriori"], answer: 0 },
        { q: "Which library is known for speed and performance with boosting?", options: ["TensorFlow","XGBoost","OpenCV","Matplotlib"], answer: 1 },
        { q: "What is Ensemble Learning?", options: ["Training only one model","Combining multiple models to improve performance","Reducing the number of features","Removing duplicate data"], answer: 1 },
        { q: "Which ML application recommends movies based on user preferences?", options: ["Recommendation System","Speech Recognition","Object Detection","Image Compression"], answer: 0 },
        { q: "Which algorithm identifies clusters of arbitrary shape and detects outliers?", options: ["K-Means","Linear Regression","DBSCAN","Naive Bayes"], answer: 2 },
        { q: "What is Feature Engineering?", options: ["Creating or selecting useful features to improve model performance","Building a database","Writing Python functions","Training only DL models"], answer: 0 },
        { q: "Which metric evaluates quality of clustering?", options: ["Accuracy","F1 Score","Silhouette Score","Precision"], answer: 2 },
        { q: "Which is a real-world application of clustering?", options: ["Customer Segmentation","House Price Prediction","Spam Detection using labels","Weather Forecasting"], answer: 0 }
    ],
    dl: [
        { q: "What is Deep Learning?", options: ["A programming language","A subset of ML that uses neural networks with multiple layers","A database system","A web framework"], answer: 1 },
        { q: "Which library is widely used for Deep Learning in Python?", options: ["Pandas","TensorFlow","NumPy","Matplotlib"], answer: 1 },
        { q: "Which Facebook-developed Deep Learning framework is popular for research?", options: ["PyTorch","Flask","OpenCV","SciPy"], answer: 0 },
        { q: "Which type of data is Deep Learning especially effective for?", options: ["Images","Audio","Text","All of the above"], answer: 3 },
        { q: "Which hardware speeds up Deep Learning training?", options: ["GPU","Printer","Scanner","Keyboard"], answer: 0 },
        { q: "Which component is the foundation of Deep Learning models?", options: ["Decision Trees","Artificial Neural Networks","Databases","Operating Systems"], answer: 1 },
        { q: "Which layer receives the input data in an ANN?", options: ["Hidden Layer","Output Layer","Input Layer","Activation Layer"], answer: 2 },
        { q: "Which layer performs most computations in a neural network?", options: ["Input Layer","Hidden Layer","Output Layer","Feature Layer"], answer: 1 },
        { q: "Which layer produces the final prediction of a neural network?", options: ["Input Layer","Hidden Layer","Output Layer","Bias Layer"], answer: 2 },
        { q: "Which activation function outputs values between 0 and 1?", options: ["ReLU","Sigmoid","Tanh","Softmax"], answer: 1 },
        { q: "Which activation function is most used in hidden layers?", options: ["Sigmoid","ReLU","Linear","Step Function"], answer: 1 },
        { q: "Which algorithm updates weights during neural network training?", options: ["Backpropagation","K-Means","Decision Tree","Random Forest"], answer: 0 },
        { q: "What does CNN stand for?", options: ["Convolutional Neural Network","Computer Neural Network","Connected Neural Network","Central Neural Network"], answer: 0 },
        { q: "CNN is primarily used for which type of data?", options: ["Text Data","Image Data","Audio Data","Tabular Data"], answer: 1 },
        { q: "Which layer extracts features such as edges in a CNN?", options: ["Pooling Layer","Convolution Layer","Output Layer","Flatten Layer"], answer: 1 },
        { q: "What is the main purpose of the Pooling Layer in CNN?", options: ["Increase image size","Reduce feature map dimensions","Store model weights","Generate labels"], answer: 1 },
        { q: "Which pooling method selects the maximum value from a region?", options: ["Average Pooling","Max Pooling","Global Pooling","Random Pooling"], answer: 1 },
        { q: "What does RNN stand for?", options: ["Random Neural Network","Recursive Neural Network","Recurrent Neural Network","Repeated Neural Network"], answer: 2 },
        { q: "RNN is mainly designed to process which type of data?", options: ["Image Data","Sequential Data","Tabular Data","Database Records"], answer: 1 },
        { q: "Which RNN variant overcomes the vanishing gradient problem?", options: ["CNN","LSTM","KNN","Decision Tree"], answer: 1 },
        { q: "What does GRU stand for?", options: ["General Recurrent Unit","Gated Recurrent Unit","Grouped Recurrent Unit","Global Recurrent Unit"], answer: 1 },
        { q: "What is an epoch in Deep Learning?", options: ["A single neuron","One complete pass of training dataset through the model","A loss function","A hidden layer"], answer: 1 },
        { q: "What is batch size in Deep Learning?", options: ["The number of hidden layers","The number of samples processed before updating weights","The number of epochs","The learning rate"], answer: 1 },
        { q: "What is the learning rate?", options: ["The number of neurons","The speed at which model weights are updated during training","The size of the dataset","The number of output classes"], answer: 1 },
        { q: "What is the purpose of a loss function?", options: ["Measure how far model predictions are from actual values","Increase the dataset size","Create new features","Display graphs"], answer: 0 },
        { q: "Which optimizer is most commonly used in Deep Learning?", options: ["Adam","Bubble Sort","K-Means","Decision Tree"], answer: 0 },
        { q: "Gradient Descent is mainly used to:", options: ["Increase the loss","Optimize model weights by minimizing the loss","Reduce dataset size","Generate random predictions"], answer: 1 },
        { q: "Which technique reduces overfitting in neural networks?", options: ["Dropout","Pooling","Flattening","Clustering"], answer: 0 },
        { q: "Which technique stops training when validation performance stops improving?", options: ["Early Stopping","Late Training","Batch Normalization","Cross Validation"], answer: 0 },
        { q: "What is Transfer Learning?", options: ["Training a model from scratch every time","Using a pre-trained model for a new but related task","Transferring data between databases","Moving a model to another computer"], answer: 1 },
        { q: "Which is a popular pre-trained CNN model?", options: ["VGG16","Decision Tree","K-Means","Naive Bayes"], answer: 0 },
        { q: "What is Fine-Tuning in Deep Learning?", options: ["Deleting layers from a model","Adjusting a pre-trained model's weights for a specific task","Reducing dataset size","Changing the optimizer only"], answer: 1 },
        { q: "What is an Autoencoder mainly used for?", options: ["Data Compression and Feature Learning","Image Classification","Sorting Data","Object Detection"], answer: 0 },
        { q: "What does GAN stand for?", options: ["General Artificial Network","Generative Adversarial Network","Graph Analysis Network","Global Attention Network"], answer: 1 },
        { q: "GAN consists of which two neural networks?", options: ["Generator and Discriminator","Encoder and Decoder","Input and Output","CNN and RNN"], answer: 0 },
        { q: "Which architecture revolutionized NLP using self-attention?", options: ["CNN","Transformer","KNN","Decision Tree"], answer: 1 },
        { q: "What does BERT stand for?", options: ["Bidirectional Encoder Representations from Transformers","Binary Encoding Representation Tool","Basic Encoder Recognition Technique","Bidirectional Embedded Retrieval Transformer"], answer: 0 },
        { q: "GPT models are mainly designed for:", options: ["Image Segmentation","Text Generation and Language Understanding","Audio Compression","Database Management"], answer: 1 },
        { q: "Which is a real-world application of Deep Learning?", options: ["Medical Image Diagnosis","Autonomous Vehicles","Voice Assistants","All of the above"], answer: 3 },
        { q: "Compared to traditional ML, Deep Learning generally requires:", options: ["Less data","More data","No data","Only text data"], answer: 1 }
    ],
    cv: [
        { q: "What is Computer Vision?", options: ["A programming language","A field of AI that enables computers to understand images and videos","A database system","A web framework"], answer: 1 },
        { q: "Computer Vision is a subfield of which domain?", options: ["Networking","Artificial Intelligence","Operating Systems","Cloud Computing"], answer: 1 },
        { q: "Which library is widely used for Computer Vision in Python?", options: ["NumPy","Pandas","OpenCV","Matplotlib"], answer: 2 },
        { q: "What does OpenCV stand for?", options: ["Open Computer Vision","OpenCV Vision","Optical Computer Vision","Online Computer Vision"], answer: 0 },
        { q: "Which function reads an image in OpenCV?", options: ["cv2.load()","cv2.read()","cv2.imread()","cv2.open()"], answer: 2 },
        { q: "Which function displays an image in OpenCV?", options: ["cv2.display()","cv2.imshow()","cv2.show()","cv2.image()"], answer: 1 },
        { q: "Which function saves an image in OpenCV?", options: ["cv2.imwrite()","cv2.save()","cv2.store()","cv2.export()"], answer: 0 },
        { q: "Which color format does OpenCV use by default?", options: ["RGB","BGR","HSV","CMYK"], answer: 1 },
        { q: "What is the smallest unit of a digital image?", options: ["Frame","Pixel","Grid","Layer"], answer: 1 },
        { q: "Which is a real-world application of Computer Vision?", options: ["Face Recognition","Medical Image Analysis","Autonomous Vehicles","All of the above"], answer: 3 },
        { q: "What is the purpose of converting an image to grayscale?", options: ["Increase image size","Reduce the image to one intensity channel for easier processing","Add more colors","Improve internet speed"], answer: 1 },
        { q: "Which OpenCV function converts a color image to grayscale?", options: ["cv2.gray()","cv2.cvtColor()","cv2.convertGray()","cv2.toGray()"], answer: 1 },
        { q: "Which OpenCV function resizes an image?", options: ["cv2.scale()","cv2.resize()","cv2.crop()","cv2.expand()"], answer: 1 },
        { q: "Image cropping is mainly used to:", options: ["Increase image brightness","Extract a specific region of an image","Rotate an image","Blur an image"], answer: 1 },
        { q: "What is the purpose of Gaussian Blur?", options: ["Detect edges","Reduce image noise and smooth the image","Increase contrast","Sharpen the image"], answer: 1 },
        { q: "Thresholding is mainly used to:", options: ["Convert an image into a binary image","Resize an image","Rotate an image","Compress an image"], answer: 0 },
        { q: "Which edge detection algorithm is widely used in OpenCV?", options: ["K-Means","Canny Edge Detection","Decision Tree","Random Forest"], answer: 1 },
        { q: "Which OpenCV function performs Canny Edge Detection?", options: ["cv2.edge()","cv2.canny()","cv2.Canny()","cv2.detectEdge()"], answer: 2 },
        { q: "What is Object Detection in Computer Vision?", options: ["Identifying only the color of an image","Identifying and locating objects within an image","Compressing an image","Resizing an image"], answer: 1 },
        { q: "Which algorithm is widely used for real-time object detection?", options: ["YOLO","K-Means","Linear Regression","Naive Bayes"], answer: 0 },
        { q: "What does YOLO stand for?", options: ["You Only Learn Once","You Only Look Once","Your Object Learning Operation","Young Object Locator"], answer: 1 },
        { q: "Which OpenCV-based method is commonly used for face detection?", options: ["KNN","Haar Cascade","Decision Tree","Random Forest"], answer: 1 },
        { q: "What is Image Segmentation?", options: ["Splitting an image into meaningful regions","Reducing image size","Rotating an image","Changing image colors"], answer: 0 },
        { q: "Semantic Segmentation assigns:", options: ["A class label to every pixel","A label to the entire image","A label to only one object","A random color to each pixel"], answer: 0 },
        { q: "What does OCR stand for?", options: ["Object Character Recognition","Optical Character Recognition","Online Character Reader","Open Character Recognition"], answer: 1 },
        { q: "What is the main purpose of OCR?", options: ["Detect faces","Extract text from images","Classify objects","Resize images"], answer: 1 },
        { q: "Which deep learning architecture is primarily used for image classification?", options: ["RNN","CNN","LSTM","K-Means"], answer: 1 },
        { q: "What is Feature Extraction in Computer Vision?", options: ["Removing unwanted pixels","Identifying important patterns from an image","Changing image colors","Compressing image files"], answer: 1 },
        { q: "Which technique uses a pre-trained model for a new vision task?", options: ["Transfer Learning","Gradient Descent","Clustering","Thresholding"], answer: 0 },
        { q: "Which OpenCV function draws a rectangle on an image?", options: ["cv2.box()","cv2.rectangle()","cv2.square()","cv2.drawRect()"], answer: 1 },
        { q: "Which OpenCV function draws a circle on an image?", options: ["cv2.circle()","cv2.round()","cv2.drawCircle()","cv2.arc()"], answer: 0 },
        { q: "Which OpenCV class captures video from a webcam?", options: ["cv2.VideoCapture()","cv2.Camera()","cv2.CaptureVideo()","cv2.Webcam()"], answer: 0 },
        { q: "Which color space is commonly used for color detection in OpenCV?", options: ["RGB","HSV","CMYK","LAB"], answer: 1 },
        { q: "Which OpenCV function is used for template matching?", options: ["cv2.matchTemplate()","cv2.findTemplate()","cv2.templateMatch()","cv2.detectTemplate()"], answer: 0 },
        { q: "Which Computer Vision application identifies a person's identity?", options: ["Face Recognition","Image Filtering","Thresholding","Edge Detection"], answer: 0 },
        { q: "Which OpenCV function detects contours?", options: ["cv2.findContours()","cv2.detectContours()","cv2.contours()","cv2.shapeDetect()"], answer: 0 },
        { q: "Which Computer Vision task follows an object's movement across frames?", options: ["Image Classification","Object Tracking","Thresholding","Image Filtering"], answer: 1 },
        { q: "Pose Estimation is used to:", options: ["Estimate the position of human body keypoints","Detect image colors","Compress images","Generate random images"], answer: 0 },
        { q: "Image Captioning combines Computer Vision with which field?", options: ["Networking","Natural Language Processing","Database Management","Cyber Security"], answer: 1 },
        { q: "Which Deep Learning model generates realistic images?", options: ["GAN","Decision Tree","K-Means","Naive Bayes"], answer: 0 }
    ]
};

async function loadExternalQuestions() {
    // Embed questions directly — works on file:// with zero network requests
    for (const course of coursesData) {
        if (EMBEDDED_QUESTIONS[course.id]) {
            course.questions = EMBEDDED_QUESTIONS[course.id];
        }
    }
}

function seedMockQuestions() {
    coursesData.forEach(course => {
        if (course.questions && course.questions.length > 0) return; // already loaded
        const mockQs = [];
        for (let i = 1; i <= 10; i++) {
            mockQs.push({
                q:       `Assessment Question ${i} for ${course.title}?`,
                options: ["Option A — Correct", "Option B", "Option C", "Option D"],
                answer:  0
            });
        }
        course.questions = mockQs;
    });
}

// ===============================
// ROUTER LOGIC
// ===============================

function navigateTo(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
        target.classList.add('active-view');
        appState.currentView = viewId;
        if (viewId === 'dashboard') renderDashboard();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === viewId) link.classList.add('active');
    });
    // Close mobile nav if open
    const navMenu = document.getElementById("nav-menu");
    const menuBtn = document.getElementById("menu-btn");
    if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(e.currentTarget.getAttribute('data-target'));
        });
    });
    const menuBtn = document.getElementById("menu-btn");
    const navMenu = document.getElementById("nav-menu");
    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            menuBtn.innerHTML = navMenu.classList.contains("active")
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }
}

// ===============================
// COURSE LISTING
// ===============================

function renderCourses() {
    const container = document.getElementById('courses-container');
    if (!container) return;
    container.innerHTML = '';

    coursesData.forEach(course => {
        const prog = appState.progress[course.id];

        // Status badge
        let statusBadge = '';
        if (prog) {
            const badgeColor = prog.passed ? 'var(--success)' : 'var(--danger)';
            const badgeLabel = prog.passed ? `✓ Passed (${prog.score}%)` : `✗ Failed (${prog.score}%)`;
            statusBadge = `<div style="background:${badgeColor}; color:white; padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:12px; display:inline-block; letter-spacing:0.02em;">${badgeLabel}</div>`;
        }

        // Difficulty color
        const diffColors = { Beginner: 'var(--primary-accent)', Intermediate: '#f59e0b', Advanced: 'var(--danger)' };
        const difficultyColor = diffColors[course.difficulty] || '#f59e0b';

        // CTA button label
        let btnLabel = '<i class="fas fa-pencil-alt"></i> Start Assessment';
        let btnClass = 'btn-primary';
        if (prog) {
            btnLabel = prog.passed
                ? '<i class="fas fa-eye"></i> Review Course'
                : '<i class="fas fa-redo"></i> Retry Assessment';
            btnClass = prog.passed ? 'btn-secondary' : 'btn-primary';
        }

        const cardNode = document.createElement('div');
        cardNode.className = 'card';
        cardNode.innerHTML = `
            <div class="card-img-placeholder">
                <i class="fab ${course.icon}" onerror="this.className='fas ${course.icon}'"></i>
            </div>
            <div class="card-content">
                ${statusBadge}
                <div class="card-tags">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span style="color:${difficultyColor}"><i class="fas fa-layer-group"></i> ${course.difficulty}</span>
                </div>
                <h3>${course.title}</h3>
                <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px; flex:1;">${course.subtitle}</p>
                <div class="card-action">
                    <button class="btn ${btnClass}" onclick="openCourseDetails('${course.id}')" style="width:100%;">
                        ${btnLabel}
                    </button>
                </div>
            </div>
        `;
        container.appendChild(cardNode);
    });
}

// ===============================
// COURSE DETAILS
// ===============================

function openCourseDetails(courseId) {
    appState.currentCourseId = courseId;
    const course = coursesData.find(c => c.id === courseId);
    const prog = appState.progress[courseId];

    const container = document.getElementById('course-details-container');

    // Progress bar
    let progressSection = '';
    if (prog) {
        const pct = prog.score;
        const barColor = prog.passed ? 'var(--success)' : 'var(--danger)';
        progressSection = `
            <div class="card-progress-container" style="margin-bottom:25px;">
                <div class="progress-meta">
                    <span>Your Best Score</span>
                    <span style="color:${barColor}; font-weight:800;">${pct}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-fill" style="width:${pct}%; background:${barColor};"></div>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="view-header">
            <h2 style="font-size:30px;">Course Details</h2>
            <button class="btn btn-secondary" onclick="navigateTo('courses')" style="margin-top:16px;">
                <i class="fas fa-arrow-left"></i> Back to Courses
            </button>
        </div>

        <div class="course-detail-header" style="flex-direction:column; align-items:center; text-align:center;">
            <div class="course-detail-icon" style="margin-bottom:20px;">
                <i class="fab ${course.icon}" onerror="this.className='fas ${course.icon}'"></i>
            </div>
            <div class="course-detail-info" style="width:100%;">
                <h2 style="margin-bottom:10px;">${course.title}</h2>
                <div class="course-meta" style="justify-content:center; margin-bottom:20px;">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span style="color:var(--primary-accent);"><i class="fas fa-layer-group"></i> ${course.difficulty}</span>
                    <span><i class="fas fa-question-circle"></i> ${course.questions ? course.questions.length : '—'} Questions</span>
                </div>
                <p style="margin-bottom:25px; color:var(--text-muted);">${course.subtitle}</p>

                ${progressSection}

                <div style="background:rgba(122,43,64,0.05); padding:25px; border-radius:15px; border:1px solid var(--glass-border); margin-bottom:30px; text-align:left;">
                    <h3 style="margin-bottom:12px; color:var(--primary-accent);"><i class="fas fa-info-circle"></i> Assessment Rules</h3>
                    <ul style="color:var(--text-muted); padding-left:20px; line-height:2;">
                        <li>Answer all ${course.questions ? course.questions.length : 10} multiple-choice questions.</li>
                        <li>You must score <strong style="color:var(--text-main);">70% or above</strong> to pass and earn your certificate.</li>
                        <li>Your best score across all attempts will be saved.</li>
                    </ul>
                </div>

                ${prog && prog.passed ? `
                    <div style="margin-bottom:20px;">
                        <span style="background:var(--success); color:white; padding:10px 22px; border-radius:20px; font-weight:700; display:inline-flex; align-items:center; gap:8px;">
                            <i class="fas fa-check-circle"></i> Passed with ${prog.score}%
                        </span>
                    </div>
                    <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                        <button class="btn btn-success" onclick="generateCertificate('${course.id}')">
                            <i class="fas fa-download"></i> Download Certificate
                        </button>
                        <button class="btn btn-secondary" onclick="showAnswerReview('${course.id}')">
                            <i class="fas fa-list-check"></i> Review Answers
                        </button>
                        <button class="btn btn-secondary" onclick="openAssessment('${course.id}')">
                            <i class="fas fa-redo"></i> Retake
                        </button>
                    </div>
                ` : `
                    <button class="btn btn-primary" onclick="openAssessment('${course.id}')" style="font-size:18px; padding:16px 44px;">
                        <i class="fas fa-pencil-alt"></i> ${prog ? 'Retry Assessment' : 'Start Assessment'}
                    </button>
                `}
            </div>
        </div>
    `;
    navigateTo('course-details');
}

// ===============================
// ASSESSMENT
// ===============================

function openAssessment(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course || !course.questions || course.questions.length === 0) {
        return alert('Questions are still loading. Please try again in a moment.');
    }
    appState.currentAssessment = {
        courseId,
        questions: course.questions,
        currentQ:  0,
        answers:   {}
    };
    renderAssessmentQ();
    navigateTo('assessment');
}

function renderAssessmentQ() {
    const asmt = appState.currentAssessment;
    const qData = asmt.questions[asmt.currentQ];
    const container = document.getElementById('assessment-container');
    const progressPct = Math.round(((asmt.currentQ + 1) / asmt.questions.length) * 100);

    const optionsHtml = qData.options.map((opt, optIdx) => {
        const isChecked = asmt.answers[asmt.currentQ] === optIdx ? 'checked' : '';
        return `
            <label class="quiz-option" style="display:flex; align-items:center; margin-bottom:12px; background:rgba(122,43,64,0.03); padding:18px; border-radius:10px; cursor:pointer; font-size:16px; border:1px solid rgba(122,43,64,0.12); transition:0.2s; gap:12px;">
                <input type="radio" name="aq" value="${optIdx}" ${isChecked} onchange="saveAq(${optIdx})" style="flex-shrink:0;">
                <span>${opt}</span>
            </label>
        `;
    }).join('');

    container.innerHTML = `
        <div class="view-header" style="margin-bottom:30px;">
            <h2 style="font-size:30px;">Final Assessment</h2>
            <p style="color:var(--text-muted);">Question <strong>${asmt.currentQ + 1}</strong> of <strong>${asmt.questions.length}</strong></p>
        </div>

        <div style="max-width:800px; margin:auto; background:var(--bg-panel); border:1px solid var(--glass-border); padding:50px; border-radius:20px; box-shadow:0 4px 20px rgba(0,0,0,0.04);">

            <div style="margin-bottom:8px; display:flex; justify-content:space-between; font-size:13px; color:var(--text-muted);">
                <span>Progress</span><span>${progressPct}%</span>
            </div>
            <div style="margin-bottom:28px; height:10px; background:#f3f4f6; border-radius:10px;">
                <div style="height:100%; background:var(--success); border-radius:10px; width:${progressPct}%; transition:0.35s ease-out;"></div>
            </div>

            <h3 style="font-size:21px; margin-bottom:25px; color:var(--text-main); line-height:1.4;">
                ${asmt.currentQ + 1}. ${qData.q}
            </h3>

            ${optionsHtml}

            <div style="display:flex; justify-content:space-between; margin-top:40px; gap:12px;">
                <button class="btn btn-secondary" onclick="prevAq()" ${asmt.currentQ === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                ${asmt.currentQ === asmt.questions.length - 1
                    ? `<button class="btn btn-success" onclick="submitAssessment()"><i class="fas fa-check"></i> Submit Assessment</button>`
                    : `<button class="btn btn-primary" onclick="nextAq()">Next <i class="fas fa-arrow-right"></i></button>`
                }
            </div>
        </div>
    `;
}

function saveAq(val) {
    appState.currentAssessment.answers[appState.currentAssessment.currentQ] = val;
}
function nextAq() {
    if (appState.currentAssessment.currentQ < appState.currentAssessment.questions.length - 1) {
        appState.currentAssessment.currentQ++;
        renderAssessmentQ();
    }
}
function prevAq() {
    if (appState.currentAssessment.currentQ > 0) {
        appState.currentAssessment.currentQ--;
        renderAssessmentQ();
    }
}

// ===============================
// SUBMIT & RESULT
// ===============================

function submitAssessment() {
    const asmt = appState.currentAssessment;
    let correct = 0;

    // Build review data while marking
    const reviewData = asmt.questions.map((q, idx) => {
        const userAnswer = asmt.answers[idx];
        const isCorrect  = userAnswer === q.answer;
        if (isCorrect) correct++;
        return { q: q.q, options: q.options, answer: q.answer, userAnswer, isCorrect };
    });

    const percentage = Math.round((correct / asmt.questions.length) * 100);
    const passed      = percentage >= 70;

    // Persist best score and review data
    const currentRecord = appState.progress[asmt.courseId];
    const isBetterScore = !currentRecord || percentage > currentRecord.score;
    appState.progress[asmt.courseId] = {
        score:      isBetterScore ? percentage : currentRecord.score,
        passed:     passed || (currentRecord && currentRecord.passed),
        reviewData: isBetterScore ? reviewData : (currentRecord && currentRecord.reviewData) || []
    };
    saveProgress();
    renderCourses();

    const container = document.getElementById('result-container');
    container.innerHTML = `
        <div style="max-width:620px; margin:auto; text-align:center; background:var(--bg-panel); border:1px solid var(--glass-border); padding:50px; border-radius:20px; box-shadow:0 4px 20px rgba(0,0,0,0.04);">
            <i class="fas ${passed ? 'fa-check-circle' : 'fa-times-circle'}"
               style="font-size:80px; color:${passed ? 'var(--success)' : 'var(--danger)'}; margin-bottom:20px;"></i>
            <h2 style="font-size:36px; margin-bottom:8px; color:var(--text-main);">${passed ? '🎉 Passed!' : 'Not Passed'}</h2>
            <p style="font-size:18px; color:var(--text-muted); margin-bottom:30px;">
                You scored <strong style="color:var(--text-main);">${percentage}%</strong>
                ${percentage >= 90 ? ' — Outstanding! 🌟' : percentage >= 70 ? ' — Well done!' : ' — Keep practising!'}
            </p>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:40px; text-align:left;">
                <div style="background:rgba(122,43,64,0.05); padding:16px; border-radius:10px;">
                    <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">TOTAL QUESTIONS</div>
                    <strong style="font-size:22px;">${asmt.questions.length}</strong>
                </div>
                <div style="background:rgba(16,185,129,0.07); padding:16px; border-radius:10px;">
                    <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">CORRECT</div>
                    <strong style="font-size:22px; color:var(--success);">${correct}</strong>
                </div>
                <div style="background:rgba(239,68,68,0.05); padding:16px; border-radius:10px;">
                    <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">INCORRECT</div>
                    <strong style="font-size:22px; color:var(--danger);">${asmt.questions.length - correct}</strong>
                </div>
                <div style="background:rgba(122,43,64,0.05); padding:16px; border-radius:10px;">
                    <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">PASSING MARK</div>
                    <strong style="font-size:22px;">70%</strong>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
                ${passed ? `
                    <button class="btn btn-success" onclick="generateCertificate('${asmt.courseId}')" style="width:100%;">
                        <i class="fas fa-award"></i> Download Certificate
                    </button>
                ` : ''}
                <button class="btn btn-secondary" onclick="showAnswerReview('${asmt.courseId}')" style="width:100%;">
                    <i class="fas fa-list-check"></i> Review My Answers
                </button>
                <button class="btn ${passed ? 'btn-secondary' : 'btn-primary'}" onclick="openAssessment('${asmt.courseId}')" style="width:100%;">
                    <i class="fas fa-redo"></i> ${passed ? 'Retake' : 'Retry Assessment'}
                </button>
                <button class="btn btn-secondary" onclick="openCourseDetails('${asmt.courseId}')" style="width:100%;">
                    <i class="fas fa-arrow-left"></i> Back to Course
                </button>
            </div>
        </div>
    `;
    navigateTo('result');
}

// ===============================
// ANSWER REVIEW
// ===============================

function showAnswerReview(courseId) {
    const prog = appState.progress[courseId];
    if (!prog || !prog.reviewData || prog.reviewData.length === 0) {
        return alert('No review data available. Please take the assessment first.');
    }

    const course   = coursesData.find(c => c.id === courseId);
    const container = document.getElementById('result-container');

    const questionsHtml = prog.reviewData.map((item, idx) => {
        const optionsHtml = item.options.map((opt, oi) => {
            let style = 'padding:10px 15px; border-radius:8px; margin:4px 0; font-size:14px; border:1px solid transparent;';
            let icon = '';
            if (oi === item.answer) {
                style += ' background:rgba(16,185,129,0.1); border-color:var(--success); font-weight:600;';
                icon = '<i class="fas fa-check" style="color:var(--success); margin-right:8px;"></i>';
            } else if (oi === item.userAnswer && item.userAnswer !== item.answer) {
                style += ' background:rgba(239,68,68,0.08); border-color:var(--danger);';
                icon = '<i class="fas fa-times" style="color:var(--danger); margin-right:8px;"></i>';
            } else {
                style += ' background:#f9fafb;';
            }
            return `<div style="${style}">${icon}${opt}</div>`;
        }).join('');

        const resultIcon = item.isCorrect
            ? '<i class="fas fa-check-circle" style="color:var(--success);"></i>'
            : '<i class="fas fa-times-circle" style="color:var(--danger);"></i>';

        return `
            <div style="background:var(--bg-panel); border:1px solid var(--glass-border); padding:25px; border-radius:15px; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:14px;">
                    <p style="font-weight:700; font-size:16px; line-height:1.4;">${idx + 1}. ${item.q}</p>
                    <span style="flex-shrink:0; font-size:20px;">${resultIcon}</span>
                </div>
                ${optionsHtml}
                ${item.userAnswer === undefined
                    ? `<p style="margin-top:10px; font-size:13px; color:var(--danger);">⚠️ Not answered</p>`
                    : ''}
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="view-header" style="margin-bottom:30px;">
            <h2 style="font-size:30px;">Answer Review</h2>
            <p style="color:var(--text-muted);">${course.title} — Best Score: <strong>${prog.score}%</strong></p>
            <button class="btn btn-secondary" onclick="openCourseDetails('${courseId}')" style="margin-top:16px;">
                <i class="fas fa-arrow-left"></i> Back to Course
            </button>
        </div>
        <div style="max-width:800px; margin:auto;">
            ${questionsHtml}
        </div>
    `;
    navigateTo('result');
}

// ===============================
// CERTIFICATE GENERATION
// ===============================

async function generateCertificate(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    const prog   = appState.progress[courseId];
    if (!prog || !prog.passed) return alert('A passing score of 70% or above is required to download your certificate.');

    // Prompt for student name if not set
    let studentName = appState.studentName;
    if (!studentName) {
        studentName = prompt('Please enter your full name for the certificate:', '');
        if (!studentName || !studentName.trim()) return;
        saveStudentName(studentName);
    }

    // Populate template
    document.getElementById('cert-student-name').textContent = appState.studentName;
    document.getElementById('cert-course-name').textContent  = course.title;
    document.getElementById('cert-score').textContent        = prog.score + '%';
    document.getElementById('cert-date').textContent         = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    document.getElementById('cert-id').textContent           = 'CERT-' + Date.now().toString(36).toUpperCase();

    const certElement = document.getElementById('certificate-template');
    certElement.style.left = '0px';

    try {
        const canvas  = await html2canvas(certElement, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf     = new window.jspdf.jsPDF('landscape', 'px', [800, 600]);
        pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
        pdf.save(`${appState.studentName.replace(/\s+/g, '_')}_${course.id}-certificate.pdf`);
    } catch (err) {
        console.error('Certificate generation failed:', err);
        alert('Certificate generation failed. Please try again.');
    } finally {
        certElement.style.left = '-9999px';
    }
}

// ===============================
// DASHBOARD
// ===============================

function renderDashboard() {
    const container = document.getElementById('dashboard-container');
    let certificates = 0;
    let totalAttempted = 0;
    let recentHTML = '';

    coursesData.forEach(c => {
        const prog = appState.progress[c.id];
        if (prog) {
            totalAttempted++;
            if (prog.passed) certificates++;
            const badge = prog.passed
                ? `<span style="background:var(--success); color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700;">Passed</span>`
                : `<span style="background:var(--danger);   color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700;">Failed</span>`;

            recentHTML += `
                <div style="background:rgba(122,43,64,0.04); padding:16px 20px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; border:1px solid var(--glass-border);">
                    <div>
                        <h4 style="font-size:15px; font-weight:700; margin-bottom:3px;">${c.title}</h4>
                        <p style="font-size:13px; color:var(--text-muted);">Best Score: ${prog.score}%</p>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        ${badge}
                        ${prog.passed
                            ? `<button class="btn btn-success" onclick="generateCertificate('${c.id}')" style="padding:6px 14px; font-size:13px;"><i class="fas fa-download"></i></button>`
                            : `<button class="btn btn-primary"  onclick="openAssessment('${c.id}')" style="padding:6px 14px; font-size:13px;"><i class="fas fa-redo"></i></button>`
                        }
                    </div>
                </div>
            `;
        }
    });

    if (!recentHTML) {
        recentHTML = `<p style="color:var(--text-muted); text-align:center; padding:30px 0;">No assessments taken yet. <a href="#" onclick="navigateTo('courses'); return false;" style="color:var(--primary-accent); font-weight:600;">Explore courses →</a></p>`;
    }

    // Student name section
    const nameSection = appState.studentName
        ? `<p style="color:var(--text-muted); margin-top:8px; font-size:14px;">Welcome back, <strong>${appState.studentName}</strong>!
           <button onclick="changeStudentName()" style="background:none;border:none;color:var(--primary-accent);cursor:pointer;font-size:13px;text-decoration:underline;">(change)</button></p>`
        : `<button class="btn btn-secondary" onclick="changeStudentName()" style="margin-top:12px; font-size:14px; padding:10px 20px;"><i class="fas fa-user-edit"></i> Set Your Name for Certificates</button>`;

    container.innerHTML = `
        <div class="view-header" style="margin-bottom:40px;">
            <h2 style="font-size:38px; color:var(--primary-accent);">Student Dashboard</h2>
            <p>Track your progress and download your certificates.</p>
            ${nameSection}
        </div>

        <div style="display:flex; gap:24px; margin-bottom:40px; justify-content:center; flex-wrap:wrap;">
            <div style="background:var(--bg-panel); border:1px solid var(--glass-border); padding:30px; border-radius:18px; text-align:center; min-width:200px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                <i class="fas fa-award" style="font-size:38px; color:#f59e0b; margin-bottom:12px;"></i>
                <h3 style="font-size:40px; font-weight:800; margin-bottom:4px;">${certificates}</h3>
                <p style="color:var(--text-muted); font-size:13px;">Certificates Earned</p>
            </div>
            <div style="background:var(--bg-panel); border:1px solid var(--glass-border); padding:30px; border-radius:18px; text-align:center; min-width:200px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                <i class="fas fa-book-open" style="font-size:38px; color:var(--primary-accent); margin-bottom:12px;"></i>
                <h3 style="font-size:40px; font-weight:800; margin-bottom:4px;">${totalAttempted}</h3>
                <p style="color:var(--text-muted); font-size:13px;">Courses Attempted</p>
            </div>
            <div style="background:var(--bg-panel); border:1px solid var(--glass-border); padding:30px; border-radius:18px; text-align:center; min-width:200px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
                <i class="fas fa-graduation-cap" style="font-size:38px; color:var(--success); margin-bottom:12px;"></i>
                <h3 style="font-size:40px; font-weight:800; margin-bottom:4px;">${coursesData.length}</h3>
                <p style="color:var(--text-muted); font-size:13px;">Total Courses</p>
            </div>
        </div>

        <div style="max-width:720px; margin:auto; background:var(--bg-panel); border:1px solid var(--glass-border); padding:30px; border-radius:18px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
            <h3 style="font-size:20px; margin-bottom:20px; color:var(--primary-accent);">
                <i class="fas fa-history"></i> Assessment History
            </h3>
            ${recentHTML}
        </div>
    `;
}

function changeStudentName() {
    const newName = prompt('Enter your full name for certificates:', appState.studentName || '');
    if (newName !== null && newName.trim()) {
        saveStudentName(newName);
        renderDashboard();
    }
}

// ===============================
// BOOT
// ===============================
document.addEventListener('DOMContentLoaded', initApp);