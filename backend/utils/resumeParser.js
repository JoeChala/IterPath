export const extractEmail = (text) => {
  const matches = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g);
  if (!matches) return null;

  const cleaned = matches.map(e => {
    e = e.replace(/\d+$/, "");
    const match = e.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i);
    return match ? match[0].toLowerCase() : null;
  });

  return cleaned.find(e => e !== null);
};

export const extractPhone = (text) => {
  const match = text.match(/(\+91)?[6-9]\d{9}/);
  return match ? match[0] : null;
};

export const extractCGPA = (text) => {
  const match = text.match(/CGPA[:\s]*([0-9]\.?[0-9]?)/i);
  return match ? match[1] : null;
};

export const extractSkills = (text) => {
  const skillsList = ["react", "node", "mongodb", "java", "python","next.js","postgresql","mysql","rust","c","cpp","c++","c/c++"];

  return skillsList.filter(skill =>
    text.toLowerCase().includes(skill)
  );
};

export const parseResume = (text) => {
  return {
    email: extractEmail(text),
    phone: extractPhone(text),
    cgpa: extractCGPA(text),
    skills: extractSkills(text),
  };
};