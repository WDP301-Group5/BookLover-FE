// src/utils/reactComment.ts
import { ReactType, type ReactTypeValue } from "../interfaces/ReactComment";

export const getReactColor = (react: ReactTypeValue) => {
  switch (react) {
    case ReactType.LIKE:
      return "blue.5";

    case ReactType.LOVE:
      return "pink.5";

    case ReactType.HAHA:
      return "yellow.5";

    case ReactType.WOW:
      return "orange.5";

    case ReactType.SAD:
      return "blue.4";

    case ReactType.ANGRY:
      return "red.6";

    default: // unlike
      return "gray.5";
  }
};

export const totalReact = (react: Record<string, number>): number => {
  return Object.values(react).reduce((sum, value) => sum + value, 0);
};
