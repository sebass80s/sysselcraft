"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ACT3_CITY_MAP_REFERENCE,
  getAct3CityIconUrl,
  getAct3CityNodeConfirmation,
  getVisibleAct3CityNodes,
  type Act3CityMapVisibilityContext,
  type Act3CityNodeId,
} from "../game/act3CityMapNodes";
import { getContainedAct3MapRect, getAct3NodeTipPosition, getAct3PinBoxPosition, type Act3MapRect } from "../game/act3CityMapGeometry";
import { ConfirmationDialog } from "./story/ConfirmationDialog";
import styles from "./Act3CityMap.module.css";

export type Act3CityMapProps = {
  visibility: Act3CityMapVisibilityContext;
  /** Navigation intent only; the chapter host owns routing and Story integration. */
  onConfirmNode: (nodeId: Act3CityNodeId) => void;
};

export function Act3CityMap({ visibility, onConfirmNode }: Act3CityMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [imageRect, setImageRect] = useState<Act3MapRect | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<Act3CityNodeId | null>(null);
  const nodes = getVisibleAct3CityNodes(visibility);
  // Revalidate against current props, including discovery/hunt changes while open.
  const confirmation = selectedNodeId ? getAct3CityNodeConfirmation(selectedNodeId, visibility) : null;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(([entry]) => {
      setImageRect(getContainedAct3MapRect(entry.contentRect.width, entry.contentRect.height));
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  // Forget a removed location so a later reveal cannot reopen an old prompt.
  if (selectedNodeId && !confirmation) setSelectedNodeId(null);

  return (
    <div ref={viewportRef} className={styles.viewport} aria-label="Stadskarta" role="region">
      {imageRect && (
        <div className={styles.imageArea} style={imageRect} data-act3-map-image>
          <Image src={ACT3_CITY_MAP_REFERENCE.backgroundPublicUrl} alt="Staden på andra sidan sjön" fill preload sizes="100vw" />
          {nodes.map((node) => {
            const tip = getAct3NodeTipPosition(node, { ...imageRect, left: 0, top: 0 });
            const box = getAct3PinBoxPosition(tip, Math.max(44, Math.min(62, imageRect.width * .085)))!;
            return (
              <button
                key={node.id}
                type="button"
                className={styles.pin}
                style={box}
                data-act3-node={node.id}
                aria-label={node.label}
                aria-current={node.active ? "location" : undefined}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <Image src={getAct3CityIconUrl(node.iconKey)} alt="" fill sizes="62px" />
                {node.active && <span className={styles.activeBadge} aria-hidden="true">★</span>}
              </button>
            );
          })}
        </div>
      )}
      {confirmation && (
        <ConfirmationDialog
          key={confirmation.nodeId}
          text={confirmation.text}
          acceptLabel={confirmation.buttons.accept}
          cancelLabel={confirmation.buttons.cancel}
          onCancel={() => setSelectedNodeId(null)}
          onAccept={() => {
            setSelectedNodeId(null);
            onConfirmNode(confirmation.nodeId);
          }}
        />
      )}
    </div>
  );
}
