import { FlowOpMode } from './constants';
import { FlowDetailRoute, FlowTipOffRoute } from '/@/router/routes/flow';

const ignoreFieldKeys = ['id', 'createBy', 'flowOpMode', 'problemTypeOptions'];

export const formatValues = (values: any, mode: FlowOpMode | null) => {
  const newDescription = JSON.stringify(
    JSON.parse(values.handleDescription ?? '[]')
      .filter((item) => item.value)
      .map(({ label, value }) => ({ label, value }))
  );
  const submitResult = Object.keys(values)
    .filter((key) => !ignoreFieldKeys.includes(key) && values[key] != null)
    .reduce((prev, curr) => {
      const newRes = {
        ...prev,
        [curr]: values[curr],
      };
      if (curr === 'title') {
        if (mode === FlowOpMode.Add) {
          return newRes;
        }
        return prev;
      }
      if (curr === 'description') {
        if (mode === FlowOpMode.Edit || mode === FlowOpMode.Add) {
          return newRes;
        }
        return prev;
      }
      if (curr === 'problemType' || curr === 'problemTypeLabel') {
        if (mode === FlowOpMode.Reassign || mode === FlowOpMode.Add) {
          return newRes;
        }
        return prev;
      }
      if (curr === 'handleDescription') {
        if (mode === FlowOpMode.Reassign) {
          return {
            ...prev,
            [curr]: newDescription,
          };
        }
        return prev;
      }
      if (curr === 'handleBy') {
        if (mode === FlowOpMode.Reassign) {
          return newRes;
        }
        return prev;
      }
      if (curr === 'expectHandleTime') {
        if (mode === FlowOpMode.Edit || mode === FlowOpMode.Add) {
          return newRes;
        }
        return prev;
      }
      return newRes;
    }, {});
  return submitResult;
};

export const formatFormFieldValue = (data: any, mode?: FlowOpMode | null) =>
  Object.entries({ ...(data ?? {}), flowOpMode: mode }).reduce((prev, curr) => {
    const [key, value] = curr;
    return value != null ? { ...prev, [key]: value } : prev;
  }, {});

export const formatTipOffValue = (values: any) => ({
  tipOffReason: values.tipOffReason,
  tipOffAttachment: values.tipOffAttachment,
});

export const getCreateFlowRouteByPrev = (prevId: string) => `${FlowDetailRoute.path}?prev=${prevId}`;

export const getTipOffFlowRoute = (id: string) => `${FlowTipOffRoute.path}?id=${id}`;
