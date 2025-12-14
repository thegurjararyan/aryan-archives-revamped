export const generateCoolName = () => {
  const adjs = ['Cyber', 'Lost', 'Midnight', 'Quiet', 'Neon', 'Broken', 'Analog', 'Velvet', 'Glitch', 'Paper'];
  const nouns = ['Poet', 'Wanderer', 'Coder', 'Ghost', 'Soul', 'Drifter', 'Monk', 'Echo', 'Writer'];
  return `${adjs[Math.floor(Math.random() * adjs.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Timeless';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};