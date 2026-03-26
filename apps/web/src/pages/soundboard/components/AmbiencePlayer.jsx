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
    <div className='ambiencePlayer mb-4'>
      <div className='ambiencePlayer-content'>
        <h2>Ambience Player</h2>
        {selectedAmbiences.length > 0 ? (
          selectedAmbiences.map(ambience => {
            const ambienceKey = getItemKey(ambience)
            const volume = ambienceVolumes[ambienceKey] ?? 1
            return (
              <div key={ambienceKey} className='ambience-item selected'>
                <div className='ambience-name'>
                  {ambience.title}
                  <img
                    src={`${API_BASE_URL}/content/thumb/${ambience.slug}`}
                    alt={ambience.title}
                    width="50px"
                    height="50px"
                  />
                </div>
                <Form.Range
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
          <div>No ambience selected</div>
        )}
      </div>
    </div>
  )
}
