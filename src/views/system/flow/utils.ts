export const formatValues = (values: any) => {
  const newDescription = JSON.stringify(
    JSON.parse(values.description ?? '[]')
      .filter((item) => item.value)
      .map(({ label, value }) => ({ label, value }))
  );
  return Object.keys(values)
    .filter((key) => key !== 'id' && key !== 'createBy' && values[key] != null)
    .reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: curr === 'description' ? newDescription : values[curr],
      }),
      {}
    );
};
