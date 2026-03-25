import { getItemKey } from '../utils/itemUtils'
import { API_BASE_URL } from '../utils/constants'
import { Form } from 'react-bootstrap'

export function OneShotPlayer({
  selectedOneShots,
  onOneShotClick,
  oneshotVolume,
  onOneShotVolumeChange
}) {
  return (
    <div className='oneshotPlayer mb-4'>
      <div className='oneshotPlayer-content'>
        <h2>One-Shot Player</h2>
        {selectedOneShots.length > 0 ? (
          <Form.Range
              min={0}
              max={50}
              value={oneshotVolume}
              onChange={(e) => onOneShotVolumeChange(parseFloat(e.target.value))}
            />,
          (selectedOneShots.map(oneshot => (
            <div
              key={getItemKey(oneshot)}
              className='oneshot-item selected'
              onClick={() => onOneShotClick(oneshot)}
            >
              <div className='oneshot-name'>
                {oneshot.title}
                <img
                  src={`${API_BASE_URL}/content/thumb/${oneshot.slug}`}
                  alt={oneshot.title}
                  width="50px"
                  height="50px"
                />
              </div>
            </div>
          )))
        ) : (
          <div>No oneshot selected</div>
        )}
      </div>
    </div>
  )
}
