// Dropdown option arrays are stored here for easy future editing.
const courseLevels = [
  "Early undergraduate",
  "Middle years undergraduate",
  "Late undergraduate",
  "Graduate students"
];

const classSizes = [
  "Fewer than 25",
  "25–50",
  "51–75",
  "76–150",
  "More than 150"
];

const courseModalities = [
  "In-person",
  "Online synchronous",
  "Online asynchronous",
  "Hybrid"
];

const modalityDescriptions = {
  "In-person": "Students attend class together in the same physical space.",
  "Online synchronous": "Students meet live online at scheduled times, often via video or chat.",
  "Online asynchronous": "Students complete work on their own schedule without a shared live meeting.",
  "Hybrid": "A mix of in-person and online learning where some components occur face-to-face and others remotely.",
  "HyFlex": "Students can choose to participate either in person or online for the same session."
};

const activityTypes = [
  "Lecture",
  "Homework",
  "Discussion board",
  "Exam",
  "Quiz",
  "Lab",
  "Project",
  "Reading activity",
  "Presentation",
  "Case study",
  "Other"
];

const activeLearningStrategies = [
  "Let the LLM suggest strategies",
  "Think-Pair-Share",
  "Peer instruction",
  "Case study",
  "Problem-based learning",
  "Team-based learning",
  "Reflection activity",
  "Debate or structured discussion",
  "Retrieval practice",
  "Concept mapping",
  "Collaborative writing",
  "Role-playing or simulation",
  "Other"
];

// One-sentence explanations for each strategy (courteous, instructor-facing).
const strategyExplanations = {
  "Think-Pair-Share": "Students think individually, briefly discuss ideas with a partner, then share key points with the class — a quick way to surface thinking and increase participation.",
  "Peer instruction": "Students answer conceptual questions individually and then discuss with peers to reconcile different reasoning before re-voting — effective for clarifying misconceptions.",
  "Case study": "Learners analyze a realistic scenario to apply concepts and practice decision-making in context.",
  "Problem-based learning": "Students work on open-ended problems that mirror real-world tasks, promoting deep problem-solving and integration of knowledge.",
  "Team-based learning": "Structured small teams work through prepared activities enabling accountability and collaborative application of concepts.",
  "Reflection activity": "Learners write or discuss brief reflections to consolidate learning and connect it to prior knowledge or practice.",
  "Debate or structured discussion": "Students take positions and use evidence to argue, helping them practice critical thinking and disciplinary discourse.",
  "Retrieval practice": "Students recall information from memory (e.g., low-stakes quizzes) to strengthen learning and identify gaps.",
  "Concept mapping": "Learners create visual maps of relationships between ideas, which clarifies structure and reveals misconceptions.",
  "Collaborative writing": "Small groups co-author a short text or explanation, promoting synthesis and clear communication.",
  "Role-playing or simulation": "Students enact roles or scenarios to explore perspectives and apply skills in a safe, active setting.",
  "Let the LLM suggest strategies": "Ask the model for tailored strategy suggestions based on your context, then choose what fits your teaching approach."
};

const redesignStyles = [
  "Slightly modify",
  "Completely redesign",
  "Add active learning without changing the assignment",
  "Generate multiple redesign options"
];

const documentTypes = [
  "Syllabus",
  "Existing assignment instructions",
  "Rubric",
  "Lecture slides",
  "Reading materials",
  "Learning outcomes",
  "Other"
];

// Utility to fill select inputs using arrays.
function populateSelect(selectElement, options, placeholderText) {
  const blankOption = document.createElement("option");
  blankOption.value = "";
  blankOption.textContent = placeholderText || "";
  selectElement.appendChild(blankOption);

  options.forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
  });
}

function createDocumentTypeCheckbox(labelText) {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "documentTypes";
  checkbox.value = labelText;
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(labelText));
  return label;
}

function getCheckedDocumentTypes() {
  return Array.from(document.querySelectorAll("input[name='documentTypes']:checked"))
    .map(checkbox => checkbox.value);
}

function getFormValues() {
  const form = document.getElementById("prompt-form");
  const formData = new FormData(form);
  return {
    discipline: formData.get("discipline") || "",
    courseLevel: formData.get("courseLevel") || "",
    classSize: formData.get("classSize") || "",
    courseModality: formData.get("courseModality") || "",
    activityType: formData.get("activityType") || "",
    activityTypeOther: formData.get("activityTypeOther") || "",
    strategy: formData.get("strategy") || "",
    strategyOther: formData.get("strategyOther") || "",
    timeAvailable: formData.get("timeAvailable") || "",
    learningGoals: formData.get("learningGoals") || "",
    existingAssignment: formData.get("existingAssignment") || "",
    redesignStyle: formData.get("redesignStyle") || "",
    uploadDocuments: formData.get("uploadDocuments") || "",
    documentTypes: getCheckedDocumentTypes()
  };
}

function buildTemplate(data) {
  const chosenActivityType = data.activityType === "Other"
    ? data.activityTypeOther
    : data.activityType;

  const chosenStrategy = data.strategy === "Other"
    ? data.strategyOther
    : data.strategy;

  const existingAssignmentSection = data.existingAssignment === "Yes"
    ? `This redesign is based on an existing assignment.${data.redesignStyle ? ` The instructor wants to ${data.redesignStyle.toLowerCase()}` : ""}.`
    : data.existingAssignment === "No"
      ? "This is not based on an existing assignment."
      : "";

  const uploadSection = data.uploadDocuments === "Yes"
    ? `The instructor may upload supporting documents later, such as: ${data.documentTypes.length > 0 ? data.documentTypes.join(", ") : "related course files"}.`
    : data.uploadDocuments === "No"
      ? "No supporting documents are planned for upload at this time."
      : "";

  // Build context lines, excluding blank values
  const contextLines = [];
  if (data.discipline) contextLines.push(`Course discipline: ${data.discipline}`);
  if (data.courseLevel) contextLines.push(`Course level: ${data.courseLevel}`);
  if (data.classSize) contextLines.push(`Class size: ${data.classSize}`);
  if (data.courseModality) contextLines.push(`Course modality: ${data.courseModality}`);
  if (chosenActivityType) contextLines.push(`Assignment or activity type: ${chosenActivityType}`);
  if (chosenStrategy) contextLines.push(`Chosen active learning strategy: ${chosenStrategy}`);
  if (data.timeAvailable) contextLines.push(`Time available: ${data.timeAvailable}`);
  if (data.learningGoals) contextLines.push(`Learning goals: ${data.learningGoals}`);
  if (existingAssignmentSection) contextLines.push(existingAssignmentSection);
  if (uploadSection) contextLines.push(uploadSection);

  return `You are an experienced instructional design consultant. Given the course context below, suggest concrete active-learning activities or strategies the instructor can implement quickly. Be explicit about class size or modality considerations when relevant.

${contextLines.join("\n")}

Please deliver the response in clear sections. For the chosen activity, provide:
- A brief summary of the active-learning redesign
- Student-facing instructions
- Instructor-facing facilitation notes
- Timing or sequence of steps
- Materials needed
- Suggestions for assessment or feedback
- Accessibility or inclusion considerations
- Optional variations for different class sizes or modalities

Keep the response practical and concise. Use language that an instructor can share directly with students and teaching teams.`;
}

// Placeholder for a future API-based LLM enhancement.
// This function currently returns the prompt unchanged.
// In a future version, it could call a server or client-side API to polish or rewrite the prompt.
function enhancePromptWithApi(prompt) {
  // Example placeholder:
  // return callLanguageModelApi(prompt);
  return prompt;
}

function generatePrompt() {
  const values = getFormValues();
  const prompt = buildTemplate(values);
  const enhancedPrompt = enhancePromptWithApi(prompt);
  const output = document.getElementById("generated-prompt");
  output.value = enhancedPrompt;
  document.getElementById("copy-button").disabled = !enhancedPrompt.trim();
}

function copyPrompt() {
  const output = document.getElementById("generated-prompt");
  if (!output.value.trim()) {
    return;
  }

  navigator.clipboard.writeText(output.value)
    .then(() => {
      const copyButton = document.getElementById("copy-button");
      copyButton.textContent = "Copied!";
      setTimeout(() => {
        copyButton.textContent = "Copy Prompt";
      }, 1400);
    })
    .catch(() => {
      alert("Copy failed. Please select and copy the prompt manually.");
    });
}

function updateRedesignVisibility() {
  const existingAssignment = document.getElementById("existing-assignment").value;
  const redesignGroup = document.getElementById("redesign-group");
  redesignGroup.classList.toggle("hidden", existingAssignment !== "Yes");
}

function initializeSpecificApp() {
  populateSelect(document.getElementById("course-level"), courseLevels, "select option");
  populateSelect(document.getElementById("class-size"), classSizes, "select option");
  populateSelect(document.getElementById("course-modality"), courseModalities, "select option");
  populateSelect(document.getElementById("activity-type"), activityTypes, "select option");
  populateSelect(document.getElementById("strategy"), activeLearningStrategies, "select option");
  // Wire the strategy explanation element to update when selection changes.
  const strategySelect = document.getElementById("strategy");
  if (strategySelect) {
    strategySelect.addEventListener("change", updateStrategyExplanation);
    strategySelect.addEventListener("change", updateStrategyOtherVisibility);
  }
  populateSelect(document.getElementById("redesign-style"), redesignStyles, "select option");

  const activityTypeSelect = document.getElementById("activity-type");
  if (activityTypeSelect) {
    activityTypeSelect.addEventListener("change", updateActivityTypeOtherVisibility);
  }

  const documentTypesContainer = document.getElementById("document-types");
  documentTypes.forEach(type => documentTypesContainer.appendChild(createDocumentTypeCheckbox(type)));

  document.getElementById("existing-assignment").addEventListener("change", updateRedesignVisibility);
  document.getElementById("course-modality").addEventListener("change", updateModalityDescription);
  document.getElementById("generate-button").addEventListener("click", generatePrompt);
  document.getElementById("copy-button").addEventListener("click", copyPrompt);

  updateRedesignVisibility();
  updateActivityTypeOtherVisibility();
  updateStrategyOtherVisibility();
  updateModalityDescription();
  // Initialize the explanation text (if present)
  if (typeof updateStrategyExplanation === 'function') updateStrategyExplanation();
}

function updateActivityTypeOtherVisibility() {
  const activityType = document.getElementById("activity-type")?.value;
  const group = document.getElementById("activity-type-other-group");
  if (!group) return;
  group.classList.toggle("hidden", activityType !== "Other");
}

function updateStrategyOtherVisibility() {
  const strategy = document.getElementById("strategy")?.value;
  const group = document.getElementById("strategy-other-group");
  if (!group) return;
  group.classList.toggle("hidden", strategy !== "Other");
}

function updateModalityDescription() {
  const modality = document.getElementById("course-modality")?.value;
  const description = document.getElementById("course-modality-description");
  if (!description) return;
  description.textContent = modalityDescriptions[modality] || "";
}


function updateStrategyExplanation() {
  const sel = document.getElementById("strategy");
  const expl = document.getElementById("strategy-explanation");
  if (!expl) return;
  const val = sel ? sel.value : "";
  expl.textContent = strategyExplanations[val] || "";
}

function getAbstractFormValues() {
  const form = document.getElementById("abstract-form");
  if (!form) return {};
  const formData = new FormData(form);
  return {
    discipline: formData.get("discipline") || "",
    courseLevel: formData.get("courseLevel") || "",
    classSize: formData.get("classSize") || "",
    courseModality: formData.get("courseModality") || "",
    timeAvailable: formData.get("timeAvailable") || "",
    learningGoals: formData.get("learningGoals") || ""
  };
}

function buildAbstractPrompt(data) {
  // Build context lines, excluding blank values
  const contextLines = [];
  if (data.discipline) contextLines.push(`Course discipline: ${data.discipline}`);
  if (data.courseLevel) contextLines.push(`Course level: ${data.courseLevel}`);
  if (data.classSize) contextLines.push(`Class size: ${data.classSize}`);
  if (data.courseModality) contextLines.push(`Course modality: ${data.courseModality}`);
  if (data.timeAvailable) contextLines.push(`Typical time available: ${data.timeAvailable}`);
  if (data.learningGoals) contextLines.push(`Typical learning goals: ${data.learningGoals}`);

  return `You are an experienced instructional design consultant. Given the course context below, suggest 4 concrete active-learning activities or strategies the instructor can implement quickly. For each suggestion, provide: a short title, a 2–3 sentence rationale tying it to the learning goals, student-facing instructions (brief), instructor facilitation notes (brief), and estimated time to implement. Be explicit about class size or modality considerations when relevant.

${contextLines.join("\n")}

Return the suggestions as a numbered list and keep each item concise and copy-ready.`;
}

function generateAbstractPrompt() {
  const values = getAbstractFormValues();
  const prompt = buildAbstractPrompt(values);
  const enhanced = enhancePromptWithApi(prompt);
  const output = document.getElementById("generated-abstract-prompt");
  if (output) output.value = enhanced;
  const copyButton = document.getElementById("copy-abstract-button");
  if (copyButton) copyButton.disabled = !enhanced.trim();
}

function copyAbstractPrompt() {
  const output = document.getElementById("generated-abstract-prompt");
  if (!output || !output.value.trim()) return;
  navigator.clipboard.writeText(output.value)
    .then(() => {
      const copyButton = document.getElementById("copy-abstract-button");
      copyButton.textContent = "Copied!";
      setTimeout(() => copyButton.textContent = "Copy Prompt", 1400);
    })
    .catch(() => alert("Copy failed. Please select and copy the prompt manually."));
}

function initializeAbstractApp() {
  // Populate the common selects if present on the abstract page
  const aCourseLevel = document.getElementById("a-course-level");
  const aClassSize = document.getElementById("a-class-size");
  const aCourseModality = document.getElementById("a-course-modality");
  if (aCourseLevel) populateSelect(aCourseLevel, courseLevels, "select option");
  if (aClassSize) populateSelect(aClassSize, classSizes, "select option");
  if (aCourseModality) populateSelect(aCourseModality, courseModalities, "select option");

  const genButton = document.getElementById("generate-abstract-button");
  const copyButton = document.getElementById("copy-abstract-button");
  if (genButton) genButton.addEventListener("click", generateAbstractPrompt);
  if (copyButton) copyButton.addEventListener("click", copyAbstractPrompt);
}

// Initialize the appropriate page script depending on which form exists.
if (document.getElementById("prompt-form")) {
  initializeSpecificApp();
}
if (document.getElementById("abstract-form")) {
  initializeAbstractApp();
}
