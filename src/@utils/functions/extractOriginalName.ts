const extractOriginalName = (fileName: string): string => {
  const parts = fileName.split("-");

  if (parts.length < 3) return fileName;

  return parts.slice(3).join("-");
};

export default extractOriginalName;
