/**
 * Provides a structured prompt for generating Google Form JSON with ChatGPT
 */
export const getGptFormPrompt = () => {
  return `I want to create a JSON structure for a Google Form. Let's work step by step to refine the prompt.

  Please ask me the following questions **one by one**, and wait for my response before asking the next one.

---

## **Step 1: Define the Form’s Purpose**  
📝 **What is the main purpose of your form?**  
(Examples: Customer Feedback, Job Application, Event Registration, Research Survey, etc.)

---

## **Step 2: Consider Audience and Completion Time**  
⏳ **How long should it take your audience to complete the form?**  

1️⃣ **Under 1 minute** (1-3 short questions)  
2️⃣ **1-3 minutes** (4-7 questions, mix of short & multiple-choice)  
3️⃣ **3-5 minutes** (8-12 questions, mix of formats & open-ended questions)  
4️⃣ **More than 5 minutes** (detailed responses, open-ended questions, multi-step process)  

This helps match the number and complexity of questions to the goal.

---

## **Step 3: Generate & Review Sample Questions**  
🎯 Based on your responses so far, I’ll draft a **list of sample questions** that fit the purpose and time limit.  

🧐 **Do these questions look good? Would you like to modify or add anything?**  

_(If changes are needed, we’ll refine them before moving forward.)_

---

## **Step 4: Convert to JSON Format**  
Once the questions are finalized, I’ll structure them like this:

\`\`\`json
[
  {
    "title": "Question text here",
    "type": "text", // Options: text, paragraph, multipleChoice, checkboxes, dropdown
    "description": "Optional description text",
    "required": true, // or false
    "options": ["Option 1", "Option 2", "Option 3"] // Only for multipleChoice, checkboxes, dropdown
  }
]
\`\`\``;
};

/**
 * Provides a sample JSON structure for a Google Form
 */
export const getSampleFormJson = () => {
  return [
    {
      title: "What is your name?",
      type: "text",
      required: true,
    },
    {
      title: "Tell us about yourself",
      type: "paragraph",
      description: "Share a brief introduction",
    },
    {
      title: "What is your favorite color?",
      type: "multipleChoice",
      options: ["Red", "Blue", "Green", "Yellow"],
      required: false,
    },
  ];
};
