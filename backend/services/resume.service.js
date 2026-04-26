import { parseResume } from "../utils/resumeParser.js";

export const processResume = async (text) => {
  const parsedData = parseResume(text);
  return parsedData;
};