// Version 2 prototype for the Active Learning Prompt Builder.
// This file keeps UI rendering, data definitions, and prompt logic separate.

const staircaseLevels = [
  {
    id: "step1",
    title: "Quick Start",
    effort: "Start here",
    scope: "5–15 minutes",
    description: "Add a brief activity to spark student thinking and participation.",
    examples: ["Think-Pair-Share", "Polling", "Retrieval Practice", "Minute Papers", "Muddiest Point"],
    strategies: ["Think-Pair-Share", "Polling", "Retrieval Practice", "Minute Papers", "Muddiest Point"]
  },
  {
    id: "step2",
    title: "Build Interaction",
    effort: "Bring students together",
    scope: "15–30 minutes",
    description: "Design a short, structured activity that promotes peer thinking.",
    examples: ["Peer Instruction", "Structured Discussion", "Compare-and-Contrast", "Short Case Analysis"],
    strategies: ["Peer Instruction", "Structured Discussion", "Compare-and-Contrast", "Short Case Analysis"]
  },
  {
    id: "step3",
    title: "Collaborative Practice",
    effort: "Work together",
    scope: "One class activity",
    description: "Students collaborate to apply ideas and practice skills.",
    examples: ["Small Group Problem Solving", "Concept Mapping", "Collaborative Writing", "Jigsaw Activities"],
    strategies: ["Small Group Problem Solving", "Concept Mapping", "Collaborative Writing", "Jigsaw Activities"]
  },
  {
    id: "step4",
    title: "Assignment Redesign",
    effort: "Improve an assignment",
    scope: "Single assignment",
    description: "Modify an existing task to increase engagement and learning.",
    examples: ["Peer Review", "Reflection and Revision", "Project Checkpoints", "Case-Based Redesign"],
    strategies: ["Peer Review", "Reflection and Revision", "Project Checkpoints", "Case-Based Redesign"]
  },
  {
    id: "step5",
    title: "Module Redesign",
    effort: "Sequence activities",
    scope: "Multiple class sessions",
    description: "Redesign a set of sessions to deepen engagement and practice.",
    examples: ["Problem-Based Learning", "Team-Based Learning", "Multi-Day Cases", "Scaffolded Projects"],
    strategies: ["Problem-Based Learning", "Team-Based Learning", "Multi-Day Cases", "Scaffolded Projects"]
  },
  {
    id: "step6",
    title: "Course Integration",
    effort: "Across the course",
    scope: "Whole course",
    description: "Embed active learning across the course for sustained impact.",
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

const strategyDescriptions = {
  "Peer Instruction": "Use brief peer discussion to surface student reasoning before a whole-class explanation.",
  "Think-Pair-Share": "Invite students to think independently, discuss with a partner, and share their ideas.",
  "Team-Based Learning": "Organize students into teams that apply concepts through structured accountability and feedback.",
  "Retrieval Practice": "Prompt students to recall and apply prior knowledge to strengthen long-term learning.",
  "Concept Mapping": "Help students connect ideas visually so relationships and structures become clearer.",
  "Case Study": "Ground the lesson in a realistic scenario that requires analysis and judgment.",
  "Collaborative Writing": "Have students co-create written work that builds shared understanding and revision skills.",
  "Reflection Activity": "Give students a short chance to examine their thinking, choices, and learning.",
  "Structured Discussion": "Guide conversation with clear prompts, roles, and participation norms.",
  "Problem-Based Learning": "Center the activity on a real problem that motivates inquiry and problem solving."
};

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
  previousView: null,
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

let elements = {};

function cacheElements() {
  elements = {
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
    preferredStrategy: document.getElementById("preferred-strategy"),
    preferredStrategyDescription: document.getElementById("preferred-strategy-description"),
    flowSummary: document.getElementById("flow-summary"),
    courseLevel: document.getElementById("course-level"),
    classSize: document.getElementById("class-size"),
    courseModality: document.getElementById("course-modality"),
    documentTypesContainer: document.getElementById("document-types"),
    generatedPrompt: document.getElementById("generated-prompt")
  };
}

function showView(viewId) {
  document.querySelectorAll(".page-view").forEach(view => view.classList.add("hidden"));
  const view = document.getElementById(viewId);
  if (view) {
    view.classList.remove("hidden");
  }
}

function goBack() {
  if (appState.previousView) {
    showView(appState.previousView);
    return;
  }
  showView("landing-view");
}

function initialize() {
  cacheElements();
  renderStairs();
  renderStrategyOptions();
  populateStrategySelect(elements.preferredStrategy);
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
  if (!selectElement) return;
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    selectElement.appendChild(option);
  });
}

function populateStrategySelect(selectElement) {
  if (!selectElement) return;
  selectElement.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a strategy (optional)";
  selectElement.appendChild(placeholder);

  const recommend = document.createElement("option");
  recommend.value = "Recommend one";
  recommend.textContent = "Recommend one";
  selectElement.appendChild(recommend);

  directStrategies.forEach(strategy => {
    const option = document.createElement("option");
    option.value = strategy;
    option.textContent = strategy;
    selectElement.appendChild(option);
  });
}

function renderStairs() {
  if (!elements.staircaseGrid) return;
  elements.staircaseGrid.innerHTML = "";
  staircaseLevels.forEach((level, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `stair-step stair-step--${level.id}`;
    card.innerHTML = `
      <div class="stair-top">
        <span class="stair-number">${index + 1}</span>
        <div>
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

    card.setAttribute("data-stair-id", level.id);
    card.addEventListener("click", () => selectStair(level.id));
    elements.staircaseGrid.appendChild(card);
  });

  updateStairSelection();
}

function updateStairSelection() {
  document.querySelectorAll(".stair-step").forEach(step => {
    const stairId = step.getAttribute("data-stair-id");
    const isSelected = Boolean(appState.selectedLevel && stairId === appState.selectedLevel.id);
    step.classList.toggle("is-selected", isSelected);
  });
}

function renderStrategyOptions() {
  if (!elements.strategyOptions) return;
  elements.strategyOptions.innerHTML = "";

  directStrategies.forEach(strategy => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "strategy-option";
    button.innerHTML = `
      <span class="strategy-option__label">${strategy}</span>
      <span class="strategy-option__description">${strategyDescriptions[strategy] || "Choose this strategy to tailor the prompt around it."}</span>
    `;
    button.setAttribute("title", strategyDescriptions[strategy] || strategy);
    button.addEventListener("click", () => selectDirectStrategy(strategy));
    elements.strategyOptions.appendChild(button);
  });
}

function renderDocumentOptions() {
  if (!elements.documentTypesContainer) return;
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
  const startStair = document.getElementById("start-staircase");
  if (startStair) startStair.addEventListener("click", () => {
    appState.path = "staircase";
    appState.previousView = "landing-view";
    showView("staircase-view");
  });

  const startStrategy = document.getElementById("start-strategy");
  if (startStrategy) startStrategy.addEventListener("click", () => {
    appState.path = "strategy";
    appState.previousView = "landing-view";
    showView("strategy-view");
  });

  const startAssignment = document.getElementById("start-assignment");
  if (startAssignment) startAssignment.addEventListener("click", () => {
    appState.path = "assignment";
    appState.previousView = "landing-view";
    showView("assignment-view");
  });

  const dataTargets = document.querySelectorAll("[data-target]");
  dataTargets.forEach(element => {
    element.addEventListener("click", event => {
      const target = event.currentTarget.getAttribute("data-target");
      if (target === "landing-view") {
        resetApp();
      }
      showView(target);
    });
  });

  const strategyGoBack = document.getElementById("strategy-go-back");
  if (strategyGoBack) strategyGoBack.addEventListener("click", goBack);

  const contextGoBack = document.getElementById("context-go-back");
  if (contextGoBack) contextGoBack.addEventListener("click", goBack);

  const assignmentContinue = document.getElementById("assignment-continue");
  if (assignmentContinue) assignmentContinue.addEventListener("click", () => {
    appState.assignmentType = elements.assignmentType ? elements.assignmentType.value : null;
    appState.redesignLevel = elements.redesignLevel ? elements.redesignLevel.value : null;

    if (!appState.assignmentType || !appState.redesignLevel) {
      alert("Please choose an assignment type and a redesign level to continue.");
      return;
    }

    appState.previousView = "assignment-view";
    renderContextView();
    showView("context-view");
  });

  const generateBtn = document.getElementById("generate-button");
  if (generateBtn) generateBtn.addEventListener("click", handleGenerate);

  const copyBtn = document.getElementById("copy-button");
  if (copyBtn) copyBtn.addEventListener("click", handleCopy);

  const startAgain = document.getElementById("start-again");
  if (startAgain) startAgain.addEventListener("click", () => {
    resetApp();
    showView("landing-view");
  });

  const preferredStrategySelect = document.getElementById("preferred-strategy");
  if (preferredStrategySelect) preferredStrategySelect.addEventListener("change", event => {
    appState.selectedStrategy = event.target.value || null;
    renderContextView();
  });

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
  appState.previousView = "staircase-view";
  updateStairSelection();
  renderContextView();
  showView("context-view");
}

function selectDirectStrategy(strategy) {
  appState.selectedStrategy = strategy;
  const preferredStrategy = document.getElementById("preferred-strategy");
  if (preferredStrategy) preferredStrategy.value = strategy;
  appState.previousView = "strategy-view";
  renderContextView();
  showView("context-view");
}

function renderContextView() {
  elements.flowSummary.innerHTML = buildFlowSummary();
  updateFormFields();
  toggleDocumentTypes();
  renderPreferredStrategyDescription();
}

function renderPreferredStrategyDescription() {
  const container = elements.preferredStrategyDescription;
  if (!container) return;

  const strategy = appState.selectedStrategy;
  if (!strategy || strategy === "Recommend one") {
    container.classList.add("hidden");
    container.textContent = "";
    return;
  }

  const description = strategyDescriptions[strategy] || "Choose this strategy to tailor the prompt around it.";
  container.textContent = description;
  container.classList.remove("hidden");
}

function buildFlowSummary() {
  if (appState.path === "staircase" && appState.selectedLevel) {
    const strategyLine = appState.selectedStrategy
      ? `<p><strong>Selected strategy:</strong> ${appState.selectedStrategy}</p>`
      : `<p>Select one strategy or ask the tool to recommend the best fit when you generate the prompt.</p>`;
    return `
      <p><strong>Chosen path:</strong> Scale of Change – ${appState.selectedLevel.title}</p>
      <p><strong>Suggested strategies:</strong> ${appState.selectedLevel.strategies.join(", ")}</p>
      ${strategyLine}
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
  appState.selectedStrategy = contextForm.preferredStrategy ? contextForm.preferredStrategy.value || null : appState.selectedStrategy;
  renderPreferredStrategyDescription();

  const selectedDocuments = Array.from(document.querySelectorAll("input[name='documentType']:checked")).map(checkbox => checkbox.value);
  appState.chosenDocuments = selectedDocuments;
}

function toggleDocumentTypes() {
  const container = elements.documentTypesContainer;
  if (!container) return;
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
  if (elements.generatedPrompt) elements.generatedPrompt.value = prompt;
  appState.previousView = "context-view";
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
    if (appState.selectedStrategy && appState.selectedStrategy !== "Recommend one") {
      lines.push(`- Preferred active learning strategy: ${appState.selectedStrategy}`);
    } else {
      lines.push(`- Strategy request: Recommend the best active learning strategy from the chosen level.`);
    }
  }

  if (appState.path === "strategy" && appState.selectedStrategy && appState.selectedStrategy !== "Recommend one") {
    lines.push(`- Chosen active learning strategy: ${appState.selectedStrategy}`);
  }

  if (appState.path === "assignment" && appState.selectedStrategy && appState.selectedStrategy !== "Recommend one") {
    lines.push(`- Preferred active learning strategy: ${appState.selectedStrategy}`);
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
  if (!elements.generatedPrompt) return;
  const text = elements.generatedPrompt.value || "";
  if (!text.trim()) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      const button = document.getElementById("copy-button");
      if (button) {
        button.textContent = "Copied!";
        setTimeout(() => (button.textContent = "Copy Prompt"), 1400);
      }
    }).catch(() => {});
  }
}

function resetApp() {
  appState.path = "landing";
  appState.previousView = null;
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
  updateStairSelection();
  const ctxForm = document.getElementById("context-form");
  if (ctxForm) ctxForm.reset();
  const preferredStrategySelect = document.getElementById("preferred-strategy");
  if (preferredStrategySelect) preferredStrategySelect.value = "";
  const noRadio = document.querySelector("input[name='uploadDocuments'][value='No']");
  renderPreferredStrategyDescription();
  if (noRadio) noRadio.checked = true;
  toggleDocumentTypes();
}

initialize();
