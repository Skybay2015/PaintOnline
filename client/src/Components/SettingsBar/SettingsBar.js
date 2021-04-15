import React from 'react';
import toolState from '../../store/toolState';

const SettingsBar = () => {
   return (
      <div className='settingsbar'>
         <label htmlFor='line-width'>Line width</label>
         <input
            onChange={(e) => toolState.setLineWidth(e.target.value)}
            id='line-width'
            type='number'
            style={{ margin: '0 16px' }}
            defaultValue={1}
            min={1}
            max={50}
         />

         <label htmlFor='stroke-color'>Stroke color</label>
         <input
            onChange={(e) => toolState.setStrokeColor(e.target.value)}
            id='stroke-color'
            type='color'
            style={{ margin: '0 16px' }}
            defaultValue={1}
            min={1}
            max={50}
         />
      </div>
   );
};

export default SettingsBar;
