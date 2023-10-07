type TDate = {
  date: string;
  time: string;
};

export const user_date = (date: Date): TDate => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth();
  const day = new Date(date).getDate();

  const hours = new Date(date).getHours();
  const minutes = new Date(date).getMinutes();

  return {
    date: `${month}/${day}/${year}`,
    time: `${hours}:${minutes}`,
  };
};
