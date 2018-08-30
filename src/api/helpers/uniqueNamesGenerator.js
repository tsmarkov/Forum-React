export const generateName = (name = '') => {
  let newName = name.replace(/[&;$"#}{]\[.]/g, "");
  return new Date().getTime() + newName;
}