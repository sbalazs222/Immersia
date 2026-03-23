import { getItemKey } from '../utils/itemUtils'
import { API_BASE_URL } from '../utils/constants'

export function AmbiencePlayer({
  selectedAmbiences,
  onAmbienceClick
}) {
  return (
    <div className='ambiencePlayer mb-4'>
      <div className='ambiencePlayer-content'>
        <h2>Ambience Player</h2>
        {selectedAmbiences.length > 0 ? (
          selectedAmbiences.map(ambience => (
            <div
              key={getItemKey(ambience)}
              className='ambience-item selected'
              onClick={() => onAmbienceClick(ambience)}
            >
              <div className='ambience-name'>
                {ambience.title}
                <img
                  src={`${API_BASE_URL}/content/thumb/${ambience.slug}`}
                  alt={ambience.title}
                  width="50px"
                  height="50px"
                />
              </div>
            </div>
          ))
        ) : (
          <div>No ambience selected</div>
        )}
      </div>
    </div>
  )
}
