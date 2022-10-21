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

export const formatEvaluateValues = (values: any) => {
  const scoreForCreatorArr: string[] = [];
  const scoreArr: string[] = [];
  const submitResult: any = Object.keys(values)
    .filter((key) => !['title'].includes(key) && values[key] != null)
    .reduce((prev, curr) => {
      const newRes = {
        ...prev,
        [curr]: values[curr],
      };
      if (/^(scoreForCreator)[0-9]+$/.test(curr)) {
        scoreForCreatorArr.push(values[curr]);
        return prev;
      } else if (/^(score)[0-9]+$/.test(curr)) {
        scoreArr.push(values[curr]);
        return prev;
      }
      return newRes;
    }, {});
  if (scoreForCreatorArr.length) {
    return {
      ...submitResult,
      scoreForCreator: scoreForCreatorArr,
    };
  }
  if (scoreArr.length) {
    return {
      ...submitResult,
      score: scoreForCreatorArr,
    };
  }
  return submitResult;
};

export const formatFormFieldValue = (data: any, mode?: FlowOpMode | null) =>
  Object.entries({ ...(data ?? {}), flowOpMode: mode }).reduce((prev, curr) => {
    const [key, value] = curr;
    return value != null ? { ...prev, [key]: value } : prev;
  }, {});

export const formatEvaluateFormFieldValue = (data: any) =>
  Object.entries(data ?? {}).reduce((prev, curr) => {
    const [key, value] = curr;
    if (key === 'score' || key === 'scoreForCreator') {
      const scoreDict = [].concat((value ?? []) as any).reduce(
        (pDict, cItem, cIndex) => ({
          ...pDict,
          [`${key}${cIndex}`]: cItem,
        }),
        {}
      );
      return {
        ...prev,
        ...scoreDict,
      };
    }
    return value != null ? { ...prev, [key]: value } : prev;
  }, {});

export const formatTipOffValue = (values: any) => ({
  tipOffReason: values.tipOffReason,
  tipOffAttachment: values.tipOffAttachment,
});

export const getCreateFlowRouteByPrev = () => `${FlowDetailRoute.path}`;

export const getTipOffFlowRoute = () => `${FlowTipOffRoute.path}`;
