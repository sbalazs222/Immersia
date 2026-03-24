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
    <div className='scenePlayer mb-4'>
      <div className='scenePlayer-content'>
        <h2>Scene Player</h2>
        {selectedScene ? (
          <div className='scene-item selected'>
            <div className='scene-name'>
              {selectedScene.title}
              <img
                src={`${API_BASE_URL}/content/thumb/${selectedScene.slug}`}
                alt={selectedScene.title}
                width="50px"
                height="50px"
              />
            </div>
            <Form.Range
              min={0}
              max={50}
              value={sceneVolume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            />
            <Button onClick={(e) => { e.stopPropagation(); onTogglePause() }} variant={isScenePaused ? 'secondary' : 'warning'}>
              {isScenePaused ? '▶ Play' : '⏸ Pause'}
            </Button>
            <Button onClick={(e) => { e.stopPropagation(); sceneMode !== 'explore' && onSceneModeChange('explore') }}>Explore</Button>
            <Button onClick={(e) => { e.stopPropagation(); sceneMode !== 'combat' && onSceneModeChange('combat') }}>Combat</Button>
          </div>
        ) : (
          <div>No scene selected</div>
        )}
      </div>
    </div>
  )
}
