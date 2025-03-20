const generateAvatarLabel = (name: string | undefined) => {
  if (!name) return;
  if (name.length < 2) return name;

  const f = name[0].toUpperCase();
  const s = name[1].toLowerCase();

  return f + s;
};

export default generateAvatarLabel;
