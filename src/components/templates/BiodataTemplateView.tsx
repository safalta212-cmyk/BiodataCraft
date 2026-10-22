import React from 'react';
import { BiodataData } from '../../types/biodata';
import { Template } from '../../types/template';
import { BiodataRenderer } from '../renderer/BiodataRenderer';

export interface BiodataTemplateViewProps {
  data: BiodataData;
  templateOverride?: Template;
  scale?: number;
  id?: string;
  isPrintMode?: boolean;
}

/**
 * BiodataTemplateView
 * Backward-compatible wrapper that delegates to the modular Phase 5 BiodataRenderer
 */
export const BiodataTemplateView: React.FC<BiodataTemplateViewProps> = ({
  data,
  templateOverride,
  scale = 1,
  id = 'biodata-print-container',
  isPrintMode = false
}) => {
  return (
    <BiodataRenderer
      data={data}
      templateConfig={templateOverride?.templateConfig}
      scale={scale}
      id={id}
      isPrintMode={isPrintMode}
    />
  );
};
