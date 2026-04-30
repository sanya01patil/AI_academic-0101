export const formatShapText = (text: string) => {
  return text.length > 150 ? text.substring(0, 147) + '...' : text;
};

export const getSignalStrength = (value: number) => {
  if (value > 80) return 'critical';
  if (value > 50) return 'high';
  return 'moderate';
};
