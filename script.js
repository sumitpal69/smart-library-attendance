/* =========================================
   SMART LIBRARY ATTENDANCE
   Frontend Prototype
========================================= */


/* -----------------------------------------
   DEMO DATABASE
----------------------------------------- */

let students = [

  {
    id: "ST001",
    name: "Student 001",
    present: true,
    time: "08:41 AM",
    camera: "Entrance",
    method: "Face"
  },

  {
    id: "ST002",
    name: "Student 002",
    present: true,
    time: "08:44 AM",
    camera: "Entrance",
    method: "Face"
  },

  {
    id: "ST003",
    name: "Student 003",
    present: true,
    time: "08:49 AM",
    camera: "Reading Hall",
    method: "Manual"
  },

  {
    id: "ST004",
    name: "Student 004",
    present: true,
    time: "09:02 AM",
    camera: "Entrance",
    method: "Face"
  }

];


/* -----------------------------------------
   LIBRARY SETTINGS
----------------------------------------- */

const library = {

  totalStudents: 100,

  lateStudents: 7,

  cameras: [

    {
      name: "Entrance Camera",
      location: "Main entrance",
      online: true
    },

    {
      name: "Reading Hall",
      location: "Ground floor",
      online: true
    },

    {
      name: "Second Floor",
      location: "Study area",
      online: false
    }

  ]

};


/* -----------------------------------------
   INITIALIZE DASHBOARD
----------------------------------------- */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    updateStatistics();

    updateAttendanceCircle();

    updateAttendanceTable();

    updateCameraStatus();

  }
);


/* -----------------------------------------
   UPDATE STATISTICS
----------------------------------------- */

function updateStatistics() {

  const present =
    students.filter(
      student => student.present
    ).length;


  const total =
    library.totalStudents;


  const percentage =
    total > 0
      ? Math.round(
          (present / total) * 100
        )
      : 0;


  document.getElementById(
    "presentCount"
  ).textContent = present;


  document.getElementById(
    "totalStudents"
  ).textContent = total;


  document.getElementById(
    "attendancePercent"
  ).textContent =
    percentage + "%";


  document.getElementById(
    "lateCount"
  ).textContent =
    library.lateStudents;

}


/* -----------------------------------------
   ATTENDANCE CIRCLE
----------------------------------------- */

function updateAttendanceCircle() {

  const present =
    students.filter(
      student => student.present
    ).length;


  const total =
    library.totalStudents;


  const percentage =
    total > 0
      ? Math.round(
          (present / total) * 100
        )
      : 0;


  const circle =
    document.querySelector(
      ".attendance-circle"
    );


  if (!circle) return;


  const degrees =
    percentage * 3.6;


  circle.style.background =

    `conic-gradient(
      #756dff 0deg ${degrees}deg,
      #e9eaf4 ${degrees}deg 360deg
    )`;


  const number =
    circle.querySelector("strong");


  if (number) {

    number.textContent =
      percentage + "%";

  }

}


/* -----------------------------------------
   ATTENDANCE TABLE
----------------------------------------- */

function updateAttendanceTable() {

  const table =
    document.querySelector(".table");


  if (!table) return;


  /*
    Keep the existing table header.
  */

  const header =
    table.querySelector(".table-header");


  table.innerHTML = "";


  if (header) {

    table.appendChild(header);

  }


  students.forEach(
    student => {

      const row =
        document.createElement("div");


      row.className =
        "table-row";


      const methodClass =
        student.method === "Manual"
          ? "method manual"
          : "method";


      row.innerHTML = `

        <strong>
          ${student.name}
        </strong>

        <span>
          ${student.time}
        </span>

        <span>
          ${student.camera}
        </span>

        <span class="${methodClass}">
          ${student.method}
        </span>

        <b class="present">
          ✓ Present
        </b>

      `;


      table.appendChild(row);

    }
  );

}


/* -----------------------------------------
   CAMERA STATUS
----------------------------------------- */

function updateCameraStatus() {

  const cameraElements =
    document.querySelectorAll(
      ".camera"
    );


  cameraElements.forEach(
    (element, index) => {

      const camera =
        library.cameras[index];


      if (!camera) return;


      const status =
        element.querySelector("b");


      if (!status) return;


      if (camera.online) {

        status.textContent =
          "● Online";

        status.className =
          "online";

      }

      else {

        status.textContent =
          "● Offline";

        status.className =
          "offline";

      }

    }
  );

}


/* =========================================
   FUTURE AI ATTENDANCE ENGINE
========================================= */


/*
   IMPORTANT:

   This function is ONLY a placeholder.

   The GitHub website cannot directly access
   the library's CCTV cameras.

   In the real system, a secure backend will
   send verified recognition events here.

*/


function receiveAttendanceEvent(event) {

  /*
    Example event:

    {
      studentId: "ST001",
      confidence: 0.98,
      camera: "Entrance",
      timestamp: "08:41 AM"
    }

  */


  if (!event) return;


  /*
    Never automatically accept an uncertain
    recognition result.

    The backend should perform the actual
    confidence calibration and verification.
  */


  if (
    typeof event.confidence !== "number"
  ) {

    console.log(
      "Recognition rejected: missing confidence."
    );

    return;

  }


  /*
    Example prototype threshold.

    THIS IS NOT a scientifically validated
    threshold and must not be used for real
    biometric deployment.
  */


  const DEMO_THRESHOLD = 0.95;


  if (
    event.confidence <
    DEMO_THRESHOLD
  ) {

    console.log(
      "Recognition requires manual verification."
    );

    return;

  }


  const student =
    students.find(
      person =>
        person.id ===
        event.studentId
    );


  if (!student) {

    console.log(
      "Student not found."
    );

    return;

  }


  /*
    Avoid duplicate attendance
    during the same session.
  */

  if (student.present) {

    console.log(
      "Attendance already recorded."
    );

    return;

  }


  student.present = true;

  student.time =
    event.timestamp ||
    new Date().toLocaleTimeString();

  student.camera =
    event.camera ||
    "Unknown";

  student.method =
    "Face";


  updateStatistics();

  updateAttendanceCircle();

  updateAttendanceTable();

}


/* -----------------------------------------
   MANUAL ATTENDANCE
----------------------------------------- */

function markManualAttendance(
  studentId
) {

  const student =
    students.find(
      person =>
        person.id === studentId
    );


  if (!student) {

    console.log(
      "Student not found."
    );

    return;

  }


  student.present = true;

  student.time =
    new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  student.camera =
    "Manual";

  student.method =
    "Manual";


  updateStatistics();

  updateAttendanceCircle();

  updateAttendanceTable();

}


/* -----------------------------------------
   CAMERA EVENT
----------------------------------------- */

function cameraHeartbeat(
  cameraIndex,
  online
) {

  if (
    !library.cameras[cameraIndex]
  ) {

    return;

  }


  library.cameras[
    cameraIndex
  ].online = online;


  updateCameraStatus();

}


/* =========================================
   DEMO TEST
========================================= */


/*
   This function allows us to test how
   the dashboard will react to an AI
   recognition event.

   We are NOT using real faces yet.
*/


function demoRecognition() {

  /*
    Find a student who is currently absent.
  */

  const student =
    students.find(
      person =>
        !person.present
    );


  if (!student) {

    console.log(
      "No absent demo student available."
    );

    return;

  }


  receiveAttendanceEvent({

    studentId:
      student.id,

    confidence:
      0.98,

    camera:
      "Entrance",

    timestamp:
      new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      )

  });

}


/* =========================================
   SECURITY NOTE
========================================= */


/*
   DO NOT put real facial-recognition
   credentials, camera passwords,
   API keys or biometric templates
   inside this JavaScript file.

   This file is publicly visible when
   hosted on GitHub Pages.

   The real CCTV + AI processing will
   happen on a secure backend.
*/y
