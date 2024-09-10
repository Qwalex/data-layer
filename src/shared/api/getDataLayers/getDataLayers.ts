type TGetDataLayersProps = {
  short?: boolean;
};

export const getDataLayers = async (
  { short }: TGetDataLayersProps = {}
) => {
  const searchParams = new URLSearchParams({
    short: short ? '1' : '0',
  });
  const res = await fetch(process.env.URL + `/api/dataLayer?${searchParams}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Ошибка получения данных - getDataLayers");
  }
  const dataLayers = res.json();

  return dataLayers;
};
