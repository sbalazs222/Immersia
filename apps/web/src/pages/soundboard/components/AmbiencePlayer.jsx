import { Form } from 'react-bootstrap'
import { getItemKey } from '../utils/itemUtils'
import { API_BASE_URL } from '../utils/constants'

export function AmbiencePlayer({
  selectedAmbiences,
  onAmbienceClick,
  ambienceVolumes,
  onAmbienceVolumeChange
}) {
  return (
    <div className='ambiencePlayer'>
      <div className='ambiencePlayer-content'>
        {selectedAmbiences.length > 0 ? (
          selectedAmbiences.map(ambience => {
            const ambienceKey = getItemKey(ambience)
            const volume = ambienceVolumes[ambienceKey] ?? 1
            return (
              <div key={ambienceKey} className='ambience-pill'>
                <img
                  src={`${API_BASE_URL}/content/thumb/${ambience.slug}`}
                  alt={ambience.title}
                />
                <div className='ambience-pill-info'>
                  <span>{ambience.title}</span>
                </div>
                <input
                type='range'
                className='custom-slider'
                  min={0}
                  max={50}
                  value={volume}
                  onChange={(e) => onAmbienceVolumeChange(ambienceKey, parseFloat(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )
          })
        ) : (
          <div className='text-muted'>No ambience selected</div>
        )}
      </div>
    </div>
  )
}
