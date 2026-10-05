// =====================================
// BACKEND API
// =====================================

const API_URL = "http://localhost:3000";


// =====================================
// ELEMENTS
// =====================================

const studentList =
    document.getElementById("studentList");

const profileCard =
    document.getElementById("profileCard");

const addStudentButton =
    document.getElementById("addStudentButton");

const editButton =
    document.getElementById("editButton");

const deleteButton =
    document.getElementById("deleteButton");

const editModal =
    document.getElementById("editModal");

const closeModal =
    document.getElementById("closeModal");

const modalTitle =
    document.getElementById("modalTitle");

const profileForm =
    document.getElementById("profileForm");

const searchInput =
    document.getElementById("searchInput");


// =====================================
// PROFILE DISPLAY
// =====================================

const studentName =
    document.getElementById("studentName");

const studentDepartment =
    document.getElementById("studentDepartment");

const studentYear =
    document.getElementById("studentYear");

const studentAbout =
    document.getElementById("studentAbout");

const skillsContainer =
    document.getElementById("skillsContainer");

const githubLink =
    document.getElementById("githubLink");

const linkedinLink =
    document.getElementById("linkedinLink");


// =====================================
// PHOTO
// =====================================

const profileImage =
    document.getElementById("profileImage");

const profileInitials =
    document.getElementById("profileInitials");


// =====================================
// FORM INPUTS
// =====================================

const nameInput =
    document.getElementById("nameInput");

const rollNumberInput =
    document.getElementById("rollNumberInput");

const departmentInput =
    document.getElementById("departmentInput");

const yearInput =
    document.getElementById("yearInput");

const aboutInput =
    document.getElementById("aboutInput");

const photoInput =
    document.getElementById("photoInput");

const removePhotoButton =
    document.getElementById("removePhotoButton");

const skillsInput =
    document.getElementById("skillsInput");

const githubInput =
    document.getElementById("githubInput");

const linkedinInput =
    document.getElementById("linkedinInput");


// =====================================
// VARIABLES
// =====================================

let students = [];

let selectedStudentId = null;

let currentPhoto = "";

let editingStudent = false;


// =====================================
// UPDATE INITIALS
// =====================================

function updateInitials(name) {

    const cleanName = name.trim();

    if (!cleanName) {

        profileInitials.textContent = "ST";

        return;
    }

    const parts =
        cleanName.split(/\s+/);

    let initials;

    if (parts.length >= 2) {

        initials =
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0);

    } else {

        initials =
            parts[0].substring(0, 2);

    }

    profileInitials.textContent =
        initials.toUpperCase();

}


// =====================================
// LOAD ALL STUDENTS
// =====================================

async function loadStudents() {

    try {

        const response =
            await fetch(`${API_URL}/students`);

        if (!response.ok) {

            throw new Error(
                "Could not load students"
            );

        }

        students =
            await response.json();


        // Render full list

        renderStudentList(students);


        // Select first student

        if (students.length > 0) {

            // If currently selected student
            // still exists, keep it selected

            const stillExists =
                students.find(
                    student =>
                        student.id === selectedStudentId
                );


            if (stillExists) {

                selectStudent(
                    selectedStudentId
                );

            } else {

                selectStudent(
                    students[0].id
                );

            }

        } else {

            showEmptyProfile();

        }

    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the backend.\n\n" +
            "Make sure your Node server is running on port 3000."
        );

    }

}


// =====================================
// RENDER STUDENT LIST
// =====================================

function renderStudentList(list = students) {

    studentList.innerHTML = "";


    // No results

    if (list.length === 0) {

        studentList.innerHTML = `
            <div class="no-results">
                No students found.
            </div>
        `;

        return;
    }


    list.forEach(student => {

        const card =
            document.createElement("div");


        card.className =
            "student-item";


        card.dataset.id =
            student.id;


        const initials =
            getInitials(student.name);


        card.innerHTML = `

            <div class="student-item-image">

                ${
                    student.photo
                    ?
                    `<img
                        src="${student.photo}"
                        alt="${escapeHTML(student.name)}"
                    >`
                    :
                    `<span>${initials}</span>`
                }

            </div>


            <div class="student-item-info">

                <h3>
                    ${escapeHTML(student.name)}
                </h3>

                <p class="roll-number">
                    ${escapeHTML(student.rollNumber)}
                </p>

                <p>
                    ${escapeHTML(student.department)}
                    · Year ${student.year}
                </p>

            </div>

        `;


        card.addEventListener(
            "click",
            () => {

                selectStudent(student.id);

            }
        );


        studentList.appendChild(card);

    });


    // Highlight selected student

    if (selectedStudentId) {

        const selectedCard =
            document.querySelector(
                `.student-item[data-id="${selectedStudentId}"]`
            );


        if (selectedCard) {

            selectedCard.classList.add(
                "selected"
            );

        }

    }

}


// =====================================
// SEARCH STUDENTS
// =====================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const filteredStudents =
                students.filter(student => {

                    const name =
                        String(student.name || "")
                            .toLowerCase();

                    const rollNumber =
                        String(student.rollNumber || "")
                            .toLowerCase();

                    const department =
                        String(student.department || "")
                            .toLowerCase();


                    return (
                        name.includes(searchTerm) ||
                        rollNumber.includes(searchTerm) ||
                        department.includes(searchTerm)
                    );

                });


            renderStudentList(
                filteredStudents
            );

        }
    );

}


// =====================================
// GET INITIALS
// =====================================

function getInitials(name) {

    const cleanName =
        String(name || "").trim();


    if (!cleanName) {

        return "ST";

    }


    const parts =
        cleanName.split(/\s+/);


    if (parts.length >= 2) {

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();

    }


    return parts[0]
        .substring(0, 2)
        .toUpperCase();

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// =====================================
// SELECT STUDENT
// =====================================

function selectStudent(id) {

    const student =
        students.find(
            student => student.id === id
        );


    if (!student) {

        return;

    }


    selectedStudentId =
        student.id;


    displayStudent(student);


    // Highlight selected student

    document
        .querySelectorAll(".student-item")
        .forEach(item => {

            item.classList.remove("selected");

        });


    const selectedCard =
        document.querySelector(
            `.student-item[data-id="${student.id}"]`
        );


    if (selectedCard) {

        selectedCard.classList.add(
            "selected"
        );

    }

}


// =====================================
// DISPLAY STUDENT
// =====================================

function displayStudent(student) {

    studentName.textContent =
        student.name || "Unknown Student";


    studentDepartment.textContent =
        student.department || "Department";


    studentYear.textContent =
        `Year ${student.year || "-"}`;


    studentAbout.textContent =
        student.about ||
        "No information available.";


    // =================================
    // SKILLS
    // =================================

    skillsContainer.innerHTML = "";


    if (
        Array.isArray(student.skills) &&
        student.skills.length > 0
    ) {

        student.skills.forEach(skill => {

            const span =
                document.createElement("span");


            span.textContent =
                skill;


            skillsContainer.appendChild(
                span
            );

        });

    } else {

        const span =
            document.createElement("span");


        span.textContent =
            "No skills added";


        skillsContainer.appendChild(
            span
        );

    }


    // =================================
    // GITHUB
    // =================================

    if (student.github) {

        githubLink.href =
            student.github;

        githubLink.style.display =
            "inline-block";

    } else {

        githubLink.style.display =
            "none";

    }


    // =================================
    // LINKEDIN
    // =================================

    if (student.linkedin) {

        linkedinLink.href =
            student.linkedin;

        linkedinLink.style.display =
            "inline-block";

    } else {

        linkedinLink.style.display =
            "none";

    }


    // =================================
    // INITIALS
    // =================================

    updateInitials(
        student.name || ""
    );


    // =================================
    // PHOTO
    // =================================

    if (student.photo) {

        profileImage.src =
            student.photo;


        profileImage.classList.add(
            "visible"
        );


        profileInitials.style.display =
            "none";

    } else {

        profileImage.src = "";


        profileImage.classList.remove(
            "visible"
        );


        profileInitials.style.display =
            "block";

    }

}


// =====================================
// EMPTY PROFILE
// =====================================

function showEmptyProfile() {

    selectedStudentId = null;


    studentName.textContent =
        "No Students";


    studentDepartment.textContent =
        "Add a student to begin";


    studentYear.textContent =
        "Year -";


    studentAbout.textContent =
        "No students have been added yet.";


    skillsContainer.innerHTML = "";


    profileImage.src = "";


    profileImage.classList.remove(
        "visible"
    );


    profileInitials.style.display =
        "block";


    profileInitials.textContent =
        "ST";

}


// =====================================
// OPEN ADD STUDENT
// =====================================

addStudentButton.addEventListener(
    "click",
    () => {

        editingStudent = false;

        selectedStudentId = null;

        currentPhoto = "";


        modalTitle.textContent =
            "Add Student";


        profileForm.reset();


        yearInput.value =
            "1";


        photoInput.value =
            "";


        editModal.classList.add(
            "active"
        );

    }
);


// =====================================
// OPEN EDIT
// =====================================

editButton.addEventListener(
    "click",
    () => {

        if (!selectedStudentId) {

            alert(
                "Please select a student first."
            );

            return;

        }


        const student =
            students.find(
                student =>
                    student.id === selectedStudentId
            );


        if (!student) {

            return;

        }


        editingStudent = true;


        modalTitle.textContent =
            "Edit Profile";


        nameInput.value =
            student.name || "";


        rollNumberInput.value =
            student.rollNumber || "";


        departmentInput.value =
            student.department || "";


        yearInput.value =
            String(student.year || 1);


        aboutInput.value =
            student.about || "";


        skillsInput.value =
            Array.isArray(student.skills)
                ? student.skills.join(", ")
                : "";


        githubInput.value =
            student.github || "";


        linkedinInput.value =
            student.linkedin || "";


        currentPhoto =
            student.photo || "";


        photoInput.value =
            "";


        editModal.classList.add(
            "active"
        );

    }
);


// =====================================
// PHOTO INPUT
// =====================================

photoInput.addEventListener(
    "change",
    () => {

        if (!photoInput.files.length) {

            return;

        }


        const file =
            photoInput.files[0];


        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image file."
            );


            photoInput.value =
                "";


            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                currentPhoto =
                    event.target.result;

            };


        reader.readAsDataURL(file);

    }
);


// =====================================
// REMOVE PHOTO
// =====================================

removePhotoButton.addEventListener(
    "click",
    () => {

        currentPhoto = "";


        photoInput.value =
            "";


        alert(
            "Profile photo removed."
        );

    }
);


// =====================================
// SAVE STUDENT
// =====================================

profileForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const skills =
            skillsInput.value
                .split(",")
                .map(skill => skill.trim())
                .filter(
                    skill => skill !== ""
                );


        const studentData = {

            name:
                nameInput.value.trim(),

            rollNumber:
                rollNumberInput.value.trim(),

            department:
                departmentInput.value.trim(),

            year:
                Number(yearInput.value),

            about:
                aboutInput.value.trim(),

            skills:
                skills,

            github:
                githubInput.value.trim(),

            linkedin:
                linkedinInput.value.trim(),

            photo:
                currentPhoto

        };


        // =================================
        // VALIDATION
        // =================================

        if (
            !studentData.name ||
            !studentData.rollNumber ||
            !studentData.department
        ) {

            alert(
                "Please fill in all required fields."
            );


            return;

        }


        try {

            let response;


            // =================================
            // EDIT EXISTING STUDENT
            // =================================

            if (editingStudent) {

                response =
                    await fetch(
                        `${API_URL}/students/${selectedStudentId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    studentData
                                )

                        }
                    );

            }


            // =================================
            // ADD NEW STUDENT
            // =================================

            else {

                response =
                    await fetch(
                        `${API_URL}/students`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    studentData
                                )

                        }
                    );

            }


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Could not save student"
                );

            }


            alert(
                editingStudent
                    ? "Student updated successfully!"
                    : "Student added successfully!"
            );


            // Close modal

            editModal.classList.remove(
                "active"
            );


            // Remember ID

            const savedStudentId =
                result.id;


            // Reload from backend

            await loadStudents();


            // Select saved student

            if (savedStudentId) {

                selectStudent(
                    savedStudentId
                );

            }


        } catch (error) {

            console.error(error);


            alert(
                "Error saving student:\n\n" +
                error.message
            );

        }

    }
);


// =====================================
// DELETE STUDENT
// =====================================

deleteButton.addEventListener(
    "click",
    async () => {

        if (!selectedStudentId) {

            alert(
                "Please select a student first."
            );


            return;

        }


        const student =
            students.find(
                student =>
                    student.id === selectedStudentId
            );


        if (!student) {

            return;

        }


        const confirmed =
            confirm(
                `Are you sure you want to delete ${student.name}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/students/${selectedStudentId}`,
                    {
                        method: "DELETE"
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Could not delete student"
                );

            }


            alert(
                "Student deleted successfully!"
            );


            selectedStudentId =
                null;


            await loadStudents();


        } catch (error) {

            console.error(error);


            alert(
                "Error deleting student:\n\n" +
                error.message
            );

        }

    }
);


// =====================================
// CLOSE MODAL
// =====================================

closeModal.addEventListener(
    "click",
    () => {

        editModal.classList.remove(
            "active"
        );

    }
);


// =====================================
// CLOSE MODAL OUTSIDE
// =====================================

editModal.addEventListener(
    "click",
    event => {

        if (event.target === editModal) {

            editModal.classList.remove(
                "active"
            );

        }

    }
);


// =====================================
// START APPLICATION
// =====================================

loadStudents();