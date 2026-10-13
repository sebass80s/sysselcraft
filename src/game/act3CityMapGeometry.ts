/** Pure geometry for a letterboxed (object-fit: contain) 1672×941 city image. */
import {
  ACT3_CITY_MAP_REFERENCE,
  type Act3CityMapNode,
} from "./act3CityMapNodes";

export type Act3MapRect = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

function positiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

/**
 * Image coordinates inside a CSS viewport, accounting for *both* pillar- and
 * letterboxing. Keep the image and pin layer inside the SAME content rectangle.
 */
export function getContainedAct3MapRect(
  viewportWidth: number,
  viewportHeight: number,
): Act3MapRect | null {
  if (!positiveFinite(viewportWidth) || !positiveFinite(viewportHeight)) return null;
  const scale = Math.min(
    viewportWidth / ACT3_CITY_MAP_REFERENCE.width,
    viewportHeight / ACT3_CITY_MAP_REFERENCE.height,
  );
  const width = ACT3_CITY_MAP_REFERENCE.width * scale;
  const height = ACT3_CITY_MAP_REFERENCE.height * scale;
  return {
    left: (viewportWidth - width) / 2,
    top: (viewportHeight - height) / 2,
    width,
    height,
  };
}

/** Return pixel position of the drawn pin tip relative to the container. */
export function getAct3NodeTipPosition(
  node: Pick<Act3CityMapNode, "xPct" | "yPct">,
  imageRect: Act3MapRect,
): Readonly<{ x: number; y: number }> {
  return {
    x: imageRect.left + imageRect.width * node.xPct / 100,
    y: imageRect.top + imageRect.height * node.yPct / 100,
  };
}

/**
 * Convert a desired pin-tip position to the SVG box's top-left.
 * Note: the visible pin tip is y=102/136; a naive translate(-50%,-100%)
 * would misalign every marker by about 25% of its displayed height.
 */
export function getAct3PinBoxPosition(
  tip: Readonly<{ x: number; y: number }>,
  renderedSvgWidth: number,
): Readonly<{ left: number; top: number; width: number; height: number }> | null {
  if (!positiveFinite(renderedSvgWidth)) return null;
  const width = renderedSvgWidth;
  const height = width * ACT3_CITY_MAP_REFERENCE.pinSvgHeight / ACT3_CITY_MAP_REFERENCE.pinSvgWidth;
  return {
    left: tip.x - width * ACT3_CITY_MAP_REFERENCE.pinTipX / ACT3_CITY_MAP_REFERENCE.pinSvgWidth,
    top: tip.y - height * ACT3_CITY_MAP_REFERENCE.pinTipY / ACT3_CITY_MAP_REFERENCE.pinSvgHeight,
    width,
    height,
  };
}
