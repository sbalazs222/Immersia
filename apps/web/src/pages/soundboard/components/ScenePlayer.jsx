import { Button, Form } from 'react-bootstrap'
import { API_BASE_URL } from '../utils/constants'

export function ScenePlayer({
  selectedScene,
  sceneVolume,
  onVolumeChange,
  sceneMode,
  onSceneModeChange,
  onPlayScene,
  isScenePaused,
  onTogglePause
}) {
  return (
    <div className='scenePlayer'>
      <div className='scenePlayer-content'>
        {selectedScene ? (
          <div className='scene-player-card'>
            <div className='scene-main-content'>
              <img
                src={`${API_BASE_URL}/content/thumb/${selectedScene.slug}`}
                alt={selectedScene.title}
              />
              <div className='scene-title-box'>
                {selectedScene.title}
              </div>
              <button className={`scene-btn ${sceneMode === 'explore' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); sceneMode !== 'explore' && onSceneModeChange('explore') }}>Explore</button>
              <button className={`scene-btn ${sceneMode === 'combat' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); sceneMode !== 'combat' && onSceneModeChange('combat') }}>Combat</button>
            </div>
            <div className='scene-controls'>
              <input
                type="range"
                orient="vertical"
                min={0}
                max={50}
                value={sceneVolume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              />
              <button className='play-circle-btn' onClick={(e) => { e.stopPropagation(); onTogglePause() }}>
                {isScenePaused ? <i className="bi bi-play-fill" style={{marginLeft: '3px'}}></i> : <i className="bi bi-pause-fill"></i>}
              </button>
            </div>
            </div>
            ) : (
            <div className='text-muted'>No scene selected</div>
        )}
          </div>
    </div>
      )
}
