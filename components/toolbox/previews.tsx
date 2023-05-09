import React from 'react';
import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox-next';
import { PaletteTree } from './palette';
import Configs from '../../pages/configs';
import HomePage from '../../pages';
const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path="/Configs">
        <Configs />
      </ComponentPreview>
      <ComponentPreview path="/HomePage">
        <HomePage />
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;
