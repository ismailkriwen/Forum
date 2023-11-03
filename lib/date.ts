type TDate = {
  date: string;
  time: string;
};

export const user_date = (date: Date): TDate => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth();
  const day = new Date(date).getDate();

  const hours = new Date(date).getHours();
  let minutes: string | number = new Date(date).getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;

  return {
    date: `${month}/${day}/${year}`,
    time: `${hours}:${minutes}`,
  };
};
