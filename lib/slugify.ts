const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+s/g, "");

const unslug = (str: string): string => str.replaceAll("%20", " ");

export { slugify, unslug };
