import { FlowDetailRoute } from '/@/router/routes/flow';

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

export const formatFormFieldValue = (data: any) =>
  Object.entries(data ?? {}).reduce((prev, curr) => {
    const [key, value] = curr;
    return value != null ? { ...prev, [key]: value } : prev;
  }, {});

export const getCreateFlowRouteByPrev = (prevId: string) => `${FlowDetailRoute.path}?prev=${prevId}`;
