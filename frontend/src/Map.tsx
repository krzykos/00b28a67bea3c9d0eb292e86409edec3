import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import './Map.css';
import { ReactComponent as MapSvg } from './map.svg';

const STATE_URL = 'http://localhost:8080/state';
type StateEntryResponse = {
  id: string;
  name: string;
  visits: number;
};
type StateResponse = StateEntryResponse[];

type StatesData = {
  [state: string]: StateEntryResponse;
};

type RangeEnum = 'S'|'M'|'L'|'XL';

export default function Map() {
  const [range, setRange] = useState<RangeEnum>('S');
  const ranges: { [range in RangeEnum]: string } = {
    'S': '0-250',
    'M': '250-500',
    'L': '500-1000',
    'XL': '1000+',
  };
  const hilight: { [range in RangeEnum]: (state: StateEntryResponse) => boolean } = {
    'S': ({ visits }) => visits <= 250,
    'M': ({ visits }) => visits > 250 && visits <= 500,
    'L': ({ visits }) => visits > 500 && visits <= 1000,
    'XL': ({ visits }) => visits > 1000,
  };

  const [statesData, setStatesData] = useState<StatesData>({});
  useEffect(() => {
    fetch(STATE_URL)
      .then(response => response.json())
      .then((response: StateResponse) => {
        const states = new Set(response.map(state => state.id));
        setStatesData(Object.fromEntries(
          Array.from(states).map(state => [state, response.find(entry => entry.id === state)!])
        ));
      });
  }, []);

  useEffect(() => {
    updateRange(range);
  });
  const rangeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setRange(event.target.value as RangeEnum);
  }, []);

  const updateRange = (range: RangeEnum) => {
    Object.values(statesData).forEach(state => {
      const style = hilight[range](state) ? 'fill: #F59200' : '';
      document
        .querySelector(`.content path[class='${state.id.toLowerCase()}']`)
        ?.setAttribute('style', style);
    });
  };

  return (
    <div className="Map">
      <div className="status">
        <label>
          <div>User visits</div>
          <select value={range} onChange={rangeChange}>
            { Object.entries(ranges).map(([k, v]) =>
              <option key={k} value={k}>{v}</option>
            )}
          </select>
        </label>
      </div>
      <div className="content">
        <MapSvg />
      </div>
    </div>
  );
}
