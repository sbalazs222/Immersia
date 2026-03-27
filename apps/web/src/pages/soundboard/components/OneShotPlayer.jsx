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
    <div className='oneshotPlayer'>
      <div className='oneshotPlayer-content'>
        {selectedOneShots.length > 0 ? (
          <>
            <input
            type='range'
              min={0}
              max={50}
              value={oneshotVolume}
              onChange={(e) => onOneShotVolumeChange(parseFloat(e.target.value))}
              className='custom-slider mb-3'
            />
            <div className='oneshot-player-grid'>
              {selectedOneShots.map(oneshot => (
                <div
                  key={getItemKey(oneshot)}
                  className='oneshot-item selected'
                  onClick={() => onOneShotClick(oneshot)}
                >
                  <div className='oneshot-name'>
                    <img
                      src={`${API_BASE_URL}/content/thumb/${oneshot.slug}`}
                      alt={oneshot.title}
                      width="50px"
                      height="50px"
                    />
                    {oneshot.title}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className='text-muted'>No oneshot selected</div>
        )}
      </div>
    </div>
  )
}
