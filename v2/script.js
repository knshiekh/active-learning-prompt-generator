// Version 2 prototype for the Active Learning Prompt Builder.
// This file keeps UI rendering, data definitions, and prompt logic separate.

const staircaseLevels = [
  {
    id: "step1",
    title: "Quick Engagement",
    effort: "Very Low",
    scope: "5–15 minutes",
    description: "Add a small burst of interaction to increase participation and attention.",
    examples: ["Think-Pair-Share", "Polling", "Retrieval Practice", "Minute Papers", "Muddiest Point"],
    strategies: ["Think-Pair-Share", "Polling", "Retrieval Practice", "Minute Papers", "Muddiest Point"]
  },
  {
    id: "step2",
    title: "Guided Interaction",
    effort: "Low",
    scope: "15–30 minutes",
    description: "Add structured interaction that helps students think together.",
    examples: ["Peer Instruction", "Structured Discussion", "Compare-and-Contrast", "Short Case Analysis"],
    strategies: ["Peer Instruction", "Structured Discussion", "Compare-and-Contrast", "Short Case Analysis"]
  },
  {
    id: "step3",
    title: "Collaborative Practice",
    effort: "Moderate",
    scope: "One class activity",
    description: "Students actively work together to apply concepts.",
    examples: ["Small Group Problem Solving", "Concept Mapping", "Collaborative Writing", "Jigsaw Activities"],
    strategies: ["Small Group Problem Solving", "Concept Mapping", "Collaborative Writing", "Jigsaw Activities"]
  },
  {
    id: "step4",
    title: "Assignment Redesign",
    effort: "Moderate to High",
    scope: "Single assignment",
    description: "Redesign an assignment to increase participation and knowledge construction.",
    examples: ["Peer Review", "Reflection and Revision", "Project Checkpoints", "Case-Based Redesign"],
    strategies: ["Peer Review", "Reflection and Revision", "Project Checkpoints", "Case-Based Redesign"]
  },
  {
    id: "step5",
    title: "Module Redesign",
    effort: "High",
    scope: "Multiple class sessions",
    description: "Redesign a sequence of activities to create deeper engagement.",
    examples: ["Problem-Based Learning", "Team-Based Learning", "Multi-Day Cases", "Scaffolded Projects"],
    strategies: ["Problem-Based Learning", "Team-Based Learning", "Multi-Day Cases", "Scaffolded Projects"]
  },
  {
    id: "step6",
    title: "Course-Level Integration",
    effort: "Highest",
    scope: "Whole course",
    description: "Integrate active learning into the structure and rhythm of the course.",
    examples: ["Recurring Active Learning Routines", "Portfolio-Based Structures", "Learning Communities", "Semester-Long Projects"],
    strategies: ["Recurring Active Learning Routines", "Portfolio-Based Structures", "Learning Communities", "Semester-Long Projects"]
  }
];

const directStrategies = [
  "Peer Instruction",
  "Think-Pair-Share",
  "Team-Based Learning",
  "Retrieval Practice",
  "Concept Mapping",
  "Case Study",
  "Collaborative Writing",
  "Reflection Activity",
  "Structured Discussion",
  "Problem-Based Learning"
];

const assignmentTypes = [
  "Lecture",
  "Homework",
  "Discussion Board",
  "Quiz",
  "Exam",
  "Lab",
  "Project",
  "Reading Activity",
  "Presentation",
  "Case Study",
  "Other"
];

const redesignLevels = [
  "Slight Modification",
  "Moderate Redesign",
  "Complete Redesign",
  "Multiple Options"
];

const courseLevels = [
  "Early Undergraduate",
  "Middle Years Undergraduate",
  "Late Undergraduate",
  "Graduate Students"
];

const classSizes = [
  "Fewer than 25",
  "25–75",
  "76–150",
  "More than 150"
];

const modalities = [
  "In-Person",
  "Online Synchronous",
  "Online Asynchronous",
  "Hybrid",
  "HyFlex"
];

const documentTypes = [
  "Syllabus",
  "Assignment Instructions",
  "Rubric",
  "Lecture Slides",
  "Readings",
  "Learning Outcomes",
  "Other"
];

const appState = {
  path: "landing",
  selectedLevel: null,
  selectedStrategy: null,
  recommendedStrategy: null,
  assignmentType: null,
  redesignLevel: null,
  context: {
    discipline: "",
    courseLevel: "",
    classSize: "",
    courseModality: "",
    timeAvailable: "",
    learningGoals: ""
  },
  uploadDocuments: "No",
  chosenDocuments: []
};

const elements = {
  landingView: document.getElementById("landing-view"),
  staircaseView: document.getElementById("staircase-view"),
  strategyView: document.getElementById("strategy-view"),
  assignmentView: document.getElementById("assignment-view"),
  contextView: document.getElementById("context-view"),
  promptView: document.getElementById("prompt-view"),
  staircaseGrid: document.getElementById("staircase-grid"),
  strategyOptions: document.getElementById("strategy-options"),
  assignmentType: document.getElementById("assignment-type"),
  redesignLevel: document.getElementById("redesign-level"),
  flowSummary: document.getElementById("flow-summary"),
  courseLevel: document.getElementById("course-level"),
  classSize: document.getElementById("class-size"),
  courseModality: document.getElementById("course-modality"),
  documentTypesContainer: document.getElementById("document-types"),
  generatedPrompt: document.getElementById("generated-prompt")
};

function showView(viewId) {
  document.querySelectorAll(".page-view").forEach(view => view.classList.add("hidden"));
  const view = document.getElementById(viewId);
  if (view) {
    view.classList.remove("hidden");
  }
}

function initialize() {
  renderStairs();
  renderStrategyOptions();
  populateSelect(elements.assignmentType, assignmentTypes);
  populateSelect(elements.redesignLevel, redesignLevels);
  populateSelect(elements.courseLevel, courseLevels);
  populateSelect(elements.classSize, classSizes);
  populateSelect(elements.courseModality, modalities);
  renderDocumentOptions();
  installEventHandlers();
  showView("landing-view");
}

function populateSelect(selectElement, items) {
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    selectElement.appendChild(option);
  });
}

function renderStairs() {
  elements.staircaseGrid.innerHTML = "";
  staircaseLevels.forEach((level, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `stair-step stair-step--${level.id}`;
    card.innerHTML = `
      <div class="stair-top">
        <span class="stair-number">${index + 1}</span>
        <div>
          <p class="stair-label">${level.effort}</p>
          <h3>${level.title}</h3>
        </div>
      </div>
      <p class="stair-scope">${level.scope}</p>
      <p class="stair-description">${level.description}</p>
      <div class="stair-examples">
        <p>Examples</p>
        <ul>
          ${level.examples.map(example => `<li>${example}</li>`).join("")}
        </ul>
      </div>
    `;

    card.addEventListener("click", () => selectStair(level.id));
    elements.staircaseGrid.appendChild(card);
  });
}

function renderStrategyOptions() {
  elements.strategyOptions.innerHTML = "";

  directStrategies.forEach(strategy => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "strategy-option";
    button.textContent = strategy;
    button.addEventListener("click", () => selectDirectStrategy(strategy));
    elements.strategyOptions.appendChild(button);
  });
}

function renderDocumentOptions() {
  elements.documentTypesContainer.innerHTML = "";
  documentTypes.forEach(type => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = type;
    checkbox.name = "documentType";

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(type));
    elements.documentTypesContainer.appendChild(label);
  });
}

function installEventHandlers() {
  document.getElementById("start-staircase").addEventListener("click", () => {
    appState.path = "staircase";
    showView("staircase-view");
  });

  document.getElementById("start-strategy").addEventListener("click", () => {
    appState.path = "strategy";
    showView("strategy-view");
  });

  document.getElementById("start-assignment").addEventListener("click", () => {
    appState.path = "assignment";
    showView("assignment-view");
  });

  document.querySelectorAll("[data-target]").forEach(element => {
    element.addEventListener("click", event => {
      const target = event.currentTarget.getAttribute("data-target");
      if (target === "landing-view") {
        resetApp();
      }
      showView(target);
    });
  });

  document.getElementById("assignment-continue").addEventListener("click", () => {
    appState.assignmentType = elements.assignmentType.value;
    appState.redesignLevel = elements.redesignLevel.value;

    if (!appState.assignmentType || !appState.redesignLevel) {
      alert("Please choose an assignment type and a redesign level to continue.");
      return;
    }

    renderContextView();
    showView("context-view");
  });

  document.getElementById("generate-button").addEventListener("click", handleGenerate);
  document.getElementById("copy-button").addEventListener("click", handleCopy);

  const uploadRadios = document.querySelectorAll("input[name='uploadDocuments']");
  uploadRadios.forEach(radio => {
    radio.addEventListener("change", event => {
      appState.uploadDocuments = event.target.value;
      toggleDocumentTypes();
    });
  });
}

function selectStair(stairId) {
  appState.selectedLevel = staircaseLevels.find(level => level.id === stairId) || null;
  appState.recommendedStrategy = "recommend";
  renderContextView();
  showView("context-view");
}

function selectDirectStrategy(strategy) {
  appState.selectedStrategy = strategy;
  renderContextView();
  showView("context-view");
}

function renderContextView() {
  elements.flowSummary.innerHTML = buildFlowSummary();
  updateFormFields();
  toggleDocumentTypes();
}

function buildFlowSummary() {
  if (appState.path === "staircase" && appState.selectedLevel) {
    return `
      <p><strong>Chosen path:</strong> Scale of Change – ${appState.selectedLevel.title}</p>
      <p><strong>Recommended strategies:</strong> ${appState.selectedLevel.strategies.join(", ")}</p>
      <p>Select one strategy or ask the tool to recommend the best fit when you generate the prompt.</p>
    `;
  }

  if (appState.path === "strategy" && appState.selectedStrategy) {
    return `
      <p><strong>Chosen path:</strong> I Know My Strategy</p>
      <p><strong>Selected strategy:</strong> ${appState.selectedStrategy}</p>
    `;
  }

  if (appState.path === "assignment") {
    return `
      <p><strong>Chosen path:</strong> I Have an Assignment</p>
      <p><strong>Assignment type:</strong> ${appState.assignmentType}</p>
      <p><strong>Redesign level:</strong> ${appState.redesignLevel}</p>
    `;
  }

  return "";
}

function updateFormFields() {
  const contextForm = document.getElementById("context-form");
  if (!contextForm) return;

  appState.context.discipline = contextForm.discipline.value;
  appState.context.courseLevel = contextForm.courseLevel.value;
  appState.context.classSize = contextForm.classSize.value;
  appState.context.courseModality = contextForm.courseModality.value;
  appState.context.timeAvailable = contextForm.timeAvailable.value;
  appState.context.learningGoals = contextForm.learningGoals.value;

  const selectedDocuments = Array.from(document.querySelectorAll("input[name='documentType']:checked")).map(checkbox => checkbox.value);
  appState.chosenDocuments = selectedDocuments;
}

function toggleDocumentTypes() {
  const container = elements.documentTypesContainer;
  if (appState.uploadDocuments === "Yes") {
    container.classList.remove("hidden");
  } else {
    container.classList.add("hidden");
    Array.from(container.querySelectorAll("input[name='documentType']")).forEach(checkbox => {
      checkbox.checked = false;
    });
    appState.chosenDocuments = [];
  }
}

function handleGenerate() {
  updateFormFields();
  const prompt = buildPrompt();
  elements.generatedPrompt.value = prompt;
  showView("prompt-view");
}

function buildPrompt() {
  const lines = [
    "You are an instructional design assistant for higher education instructors.",
    "Use the course context below to create an active-learning prompt that works with any major LLM, such as ChatGPT, Claude, Gemini, or Copilot.",
    "",
    "Course context:"
  ];

  if (appState.context.discipline) lines.push(`- Discipline: ${appState.context.discipline}`);
  if (appState.context.courseLevel) lines.push(`- Course level: ${appState.context.courseLevel}`);
  if (appState.context.classSize) lines.push(`- Class size: ${appState.context.classSize}`);
  if (appState.context.courseModality) lines.push(`- Course modality: ${appState.context.courseModality}`);
  if (appState.context.timeAvailable) lines.push(`- Time available: ${appState.context.timeAvailable}`);
  if (appState.context.learningGoals) lines.push(`- Learning goals: ${appState.context.learningGoals}`);

  if (appState.path === "staircase" && appState.selectedLevel) {
    lines.push(`- Selected change level: ${appState.selectedLevel.title} (${appState.selectedLevel.effort}, ${appState.selectedLevel.scope})`);
    if (appState.recommendedStrategy === "recommend") {
      lines.push(`- Strategy request: Recommend the best active learning strategy from the chosen level.`);
    }
  }

  if (appState.path === "strategy" && appState.selectedStrategy) {
    lines.push(`- Chosen active learning strategy: ${appState.selectedStrategy}`);
  }

  if (appState.path === "assignment") {
    lines.push(`- Assignment or activity type: ${appState.assignmentType}`);
    lines.push(`- Redesign goal: ${appState.redesignLevel}`);
  }

  if (appState.uploadDocuments === "Yes") {
    const docs = appState.chosenDocuments.length ? appState.chosenDocuments.join(", ") : "relevant course materials";
    lines.push(`- Documents for the LLM: ${docs}`);
  }

  lines.push("", "Please deliver the response in clear sections. For the chosen context, provide:");
  lines.push("- A brief summary of the proposed redesign or activity");
  lines.push("- Student-facing instructions");
  lines.push("- Instructor facilitation notes");
  lines.push("- Timing and sequence of steps");
  lines.push("- Materials needed");
  lines.push("- Suggestions for assessment or feedback");
  lines.push("- Accessibility and inclusion considerations");
  lines.push("- Variations for different class sizes or modalities");
  lines.push("", "Keep the response practical, encouraging, and suitable for college instructors.");

  if (appState.uploadDocuments === "Yes") {
    lines.push("", "If the user uploads documents, the model should use them to improve the redesign recommendations and note how the materials will be used.");
  }

  return lines.join("\n");
}

function handleCopy() {
  const text = elements.generatedPrompt.value;
  if (!text.trim()) return;

  navigator.clipboard.writeText(text).then(() => {
    const button = document.getElementById("copy-button");
    button.textContent = "Copied!";
    setTimeout(() => (button.textContent = "Copy Prompt"), 1400);
  });
}

function resetApp() {
  appState.path = "landing";
  appState.selectedLevel = null;
  appState.selectedStrategy = null;
  appState.recommendedStrategy = null;
  appState.assignmentType = null;
  appState.redesignLevel = null;
  appState.context = {
    discipline: "",
    courseLevel: "",
    classSize: "",
    courseModality: "",
    timeAvailable: "",
    learningGoals: ""
  };
  appState.uploadDocuments = "No";
  appState.chosenDocuments = [];
  document.getElementById("context-form").reset();
  document.querySelector("input[name='uploadDocuments'][value='No']").checked = true;
  toggleDocumentTypes();
}

initialize();
