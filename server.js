const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "students.json");


// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json({ limit: "10mb" }));


// Allow frontend / Live Server to communicate
app.use((req, res, next) => {

    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


// =====================================
// LOAD STUDENTS
// =====================================

function loadStudents() {

    if (!fs.existsSync(DATA_FILE)) {

        const initialStudents = [

            {
                id: 1,

                name: "Sai Vignesh",

                rollNumber: "23CSE001",

                department: "CSE",

                year: 2,

                about:
                    "Computer Science and Engineering student interested in software development, technology and building practical solutions.",

                skills: [
                    "C",
                    "C++",
                    "OOP",
                    "HTML",
                    "JavaScript"
                ],

                github:
                    "https://github.com/",

                linkedin:
                    "https://www.linkedin.com/",

                photo: ""
            },


            {
                id: 2,

                name: "Arun Kumar",

                rollNumber: "23CSE002",

                department: "CSE",

                year: 2,

                about:
                    "Student interested in software development and technology.",

                skills: [
                    "C",
                    "C++",
                    "HTML"
                ],

                github:
                    "https://github.com/",

                linkedin:
                    "https://www.linkedin.com/",

                photo: ""
            }

        ];


        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(
                initialStudents,
                null,
                2
            )
        );


        return initialStudents;
    }


    try {

        return JSON.parse(
            fs.readFileSync(
                DATA_FILE,
                "utf8"
            )
        );

    } catch (error) {

        console.error(
            "Error reading students.json:",
            error
        );

        return [];

    }

}


// =====================================
// SAVE STUDENTS
// =====================================

function saveStudents(students) {

    fs.writeFileSync(

        DATA_FILE,

        JSON.stringify(
            students,
            null,
            2
        )

    );

}


// Load students when server starts
let students = loadStudents();


// =====================================
// VALIDATION
// =====================================

function validateStudent(data) {

    const {
        name,
        rollNumber,
        department,
        year
    } = data;


    // Required fields

    if (
        !name ||
        !rollNumber ||
        !department ||
        year === undefined
    ) {

        return "All fields are required";

    }


    // String validation

    if (
        typeof name !== "string" ||
        typeof rollNumber !== "string" ||
        typeof department !== "string"
    ) {

        return (
            "Name, rollNumber and department " +
            "must be strings"
        );

    }


    // Year validation

    if (

        !Number.isInteger(
            Number(year)
        )

        ||

        Number(year) < 1

        ||

        Number(year) > 4

    ) {

        return (
            "Year must be an integer between 1 and 4"
        );

    }


    // Empty string validation

    if (

        !name.trim()

        ||

        !rollNumber.trim()

        ||

        !department.trim()

    ) {

        return (
            "Name, rollNumber and department " +
            "cannot be empty"
        );

    }


    return null;

}


// =====================================
// HOME ROUTE
// =====================================

app.get("/", (req, res) => {

    res.json({

        message:
            "Student Records API is running!"

    });

});


// =====================================
// GET ALL STUDENTS
// =====================================

app.get("/students", (req, res) => {

    res.json(students);

});


// =====================================
// GET ONE STUDENT
// =====================================

app.get("/students/:id", (req, res) => {

    const id =
        Number(req.params.id);


    if (!Number.isInteger(id)) {

        return res.status(400).json({

            error:
                "Invalid student ID"

        });

    }


    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) {

        return res.status(404).json({

            error:
                "Student not found"

        });

    }


    res.json(student);

});


// =====================================
// CREATE STUDENT
// POST /students
// =====================================

app.post("/students", (req, res) => {

    const validationError =
        validateStudent(req.body);


    if (validationError) {

        return res.status(400).json({

            error:
                validationError

        });

    }


    const {

        name,

        rollNumber,

        department,

        year,

        about = "",

        skills = [],

        github =
            "https://github.com/",

        linkedin =
            "https://www.linkedin.com/",

        photo = ""

    } = req.body;


    // =================================
    // CHECK DUPLICATE ROLL NUMBER
    // =================================

    const existingStudent =
        students.find(

            student =>

                student.rollNumber ===
                rollNumber.trim()

        );


    if (existingStudent) {

        return res.status(409).json({

            error:
                "Roll number already exists"

        });

    }


    // =================================
    // CREATE NEW ID
    // =================================

    const newId =

        students.length > 0

            ?

            Math.max(
                ...students.map(
                    student => student.id
                )
            ) + 1

            :

            1;


    // =================================
    // CREATE NEW STUDENT
    // =================================

    const newStudent = {

        id: newId,

        name:
            name.trim(),

        rollNumber:
            rollNumber.trim(),

        department:
            department.trim(),

        year:
            Number(year),

        about:
            typeof about === "string"
                ? about.trim()
                : "",

        skills:
            Array.isArray(skills)
                ? skills
                : [],

        github:
            typeof github === "string"
                ? github.trim()
                : "https://github.com/",

        linkedin:
            typeof linkedin === "string"
                ? linkedin.trim()
                : "https://www.linkedin.com/",

        photo:
            typeof photo === "string"
                ? photo
                : ""

    };


    // =================================
    // ADD TO ARRAY
    // =================================

    students.push(newStudent);


    // =================================
    // SAVE TO JSON
    // =================================

    saveStudents(students);


    // =================================
    // SEND RESPONSE
    // =================================

    res.status(201).json(newStudent);

});


// =====================================
// UPDATE STUDENT
// PUT /students/:id
// =====================================

app.put("/students/:id", (req, res) => {

    const id =
        Number(req.params.id);


    // Check ID

    if (!Number.isInteger(id)) {

        return res.status(400).json({

            error:
                "Invalid student ID"

        });

    }


    // Find student

    const student =
        students.find(

            student =>
                student.id === id

        );


    if (!student) {

        return res.status(404).json({

            error:
                "Student not found"

        });

    }


    // Validate data

    const validationError =
        validateStudent(req.body);


    if (validationError) {

        return res.status(400).json({

            error:
                validationError

        });

    }


    const {

        name,

        rollNumber,

        department,

        year,

        about = "",

        skills = [],

        github =
            "https://github.com/",

        linkedin =
            "https://www.linkedin.com/",

        photo = ""

    } = req.body;


    // =================================
    // CHECK DUPLICATE ROLL NUMBER
    // =================================

    const duplicateRollNumber =
        students.find(

            otherStudent =>

                otherStudent.rollNumber ===
                rollNumber.trim()

                &&

                otherStudent.id !== id

        );


    if (duplicateRollNumber) {

        return res.status(409).json({

            error:
                "Roll number already exists"

        });

    }


    // =================================
    // UPDATE STUDENT
    // =================================

    student.name =
        name.trim();


    student.rollNumber =
        rollNumber.trim();


    student.department =
        department.trim();


    student.year =
        Number(year);


    student.about =
        typeof about === "string"
            ? about.trim()
            : "";


    student.skills =
        Array.isArray(skills)
            ? skills
            : [];


    student.github =
        typeof github === "string"
            ? github.trim()
            : "https://github.com/";


    student.linkedin =
        typeof linkedin === "string"
            ? linkedin.trim()
            : "https://www.linkedin.com/";


    student.photo =
        typeof photo === "string"
            ? photo
            : "";


    // =================================
    // SAVE
    // =================================

    saveStudents(students);


    // =================================
    // RESPONSE
    // =================================

    res.json(student);

});


// =====================================
// DELETE STUDENT
// DELETE /students/:id
// =====================================

app.delete("/students/:id", (req, res) => {

    const id =
        Number(req.params.id);


    // Check ID

    if (!Number.isInteger(id)) {

        return res.status(400).json({

            error:
                "Invalid student ID"

        });

    }


    // Find student index

    const studentIndex =
        students.findIndex(

            student =>
                student.id === id

        );


    if (studentIndex === -1) {

        return res.status(404).json({

            error:
                "Student not found"

        });

    }


    // Remove student

    const deletedStudent =
        students.splice(
            studentIndex,
            1
        )[0];


    // Save

    saveStudents(students);


    // Response

    res.json({

        message:
            "Student deleted successfully",

        student:
            deletedStudent

    });

});


// =====================================
// UNKNOWN ROUTES
// =====================================

app.use((req, res) => {

    res.status(404).json({

        error:
            "Route not found"

    });

});


// =====================================
// START SERVER
// =====================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);