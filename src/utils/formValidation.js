/**
 * Validates the form JSON structure
 * @param {string|object} jsonData - The JSON data to validate
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateFormJson = (jsonData) => {
  try {
    // Parse JSON if it's a string
    const parsedData =
      typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

    // Check if it's an array
    if (!Array.isArray(parsedData)) {
      return {
        isValid: false,
        error: "JSON must be an array of questions",
      };
    }

    // Check if array is empty
    if (parsedData.length === 0) {
      return {
        isValid: false,
        error: "Form must contain at least one question",
      };
    }

    // Validate each question
    for (let i = 0; i < parsedData.length; i++) {
      const question = parsedData[i];

      // Check required fields
      if (!question.title) {
        return {
          isValid: false,
          error: `Question #${i + 1} is missing a title`,
        };
      }

      if (!question.type) {
        return {
          isValid: false,
          error: `Question #${i + 1} ("${question.title}") is missing a type`,
        };
      }

      // Validate question type
      const validTypes = [
        "text",
        "paragraph",
        "multipleChoice",
        "checkboxes",
        "dropdown",
      ];
      if (!validTypes.includes(question.type)) {
        return {
          isValid: false,
          error: `Question #${i + 1} ("${
            question.title
          }") has an invalid type: "${
            question.type
          }". Valid types are: ${validTypes.join(", ")}`,
        };
      }

      // Check if options are provided for question types that need them
      if (
        ["multipleChoice", "checkboxes", "dropdown"].includes(question.type)
      ) {
        if (
          !question.options ||
          !Array.isArray(question.options) ||
          question.options.length === 0
        ) {
          return {
            isValid: false,
            error: `Question #${i + 1} ("${
              question.title
            }") requires options for type "${question.type}"`,
          };
        }
      }
    }

    // All checks passed
    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid JSON syntax: ${error.message}`,
    };
  }
};

export function validateSlidesForm(formData) {
  if (!formData.title.trim()) {
    return "Please enter a presentation title";
  }

  if (!formData.topic.trim()) {
    return "Please enter a presentation topic";
  }

  if (!formData.numSlides || isNaN(parseInt(formData.numSlides))) {
    return "Please select a valid number of slides";
  }

  return null; // No errors
}
