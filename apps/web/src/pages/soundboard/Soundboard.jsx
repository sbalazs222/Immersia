import { Row, Col } from 'react-bootstrap'
import '../../styles/App.css'
import { useSoundFetch } from './hooks/useSoundFetch'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useFavourites } from './hooks/useFavourites'
import { SoundList } from './components/SoundList'
import { ScenePlayer } from './components/ScenePlayer'
import { AmbiencePlayer } from './components/AmbiencePlayer'
import { OneShotPlayer } from './components/OneShotPlayer'

function SoundBoard() {
  const {
    activeTab,
    setActiveTab,
    scenes,
    ambiences,
    oneshots,
    isLoading,
    contentAreaRef
  } = useSoundFetch()

  const {
    selectedScene,
    selectedAmbiences,
    selectedOneShots,
    sceneMode,
    setSceneMode,
    sceneVolume,
    setSceneVolume,
    ambienceVolumes,
    setAmbienceVolume,
    oneshotVolume,
    setOneShotVolume,
    isScenePaused,
    playScene,
    togglePauseScene,
    toggleAmbiencePlayback,
    toggleOneShotSelection,
    playOneShot
  } = useAudioPlayer()

  const {
    isFavourite,
    toggleFavourite
  } = useFavourites()

  return (
    <>
      <div className='soundboard-dsgn'>
        <div className='soundboard-section'>
          <div className='tabs-dsgn'>
            <div className='tabs-container'>
              <button
                className={activeTab === 'scene' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTab('scene')}
              >
                Scenes
              </button>
              <button
                className={activeTab === 'ambience' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTab('ambience')}
              >
                Ambiences
              </button>
              <button
                className={activeTab === 'oneshot' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTab('oneshot')}
              >
                One-Shots
              </button>
            </div>
          </div>

          <div className='content-area' ref={contentAreaRef}>
            {activeTab === 'scene' && (
              <SoundList
                type='scene'
                items={scenes}
                selectedItems={selectedScene ? [selectedScene] : []}
                onItemClick={(scene) => playScene(scene, false)}
                isFavourite={isFavourite}
                onFavouriteClick={toggleFavourite}
              />
            )}

            {activeTab === 'ambience' && (
              <SoundList
                type='ambience'
                items={ambiences}
                selectedItems={selectedAmbiences}
                onItemClick={toggleAmbiencePlayback}
                isFavourite={isFavourite}
                onFavouriteClick={toggleFavourite}
              />
            )}

            {activeTab === 'oneshot' && (
              <SoundList
                type='oneshot'
                items={oneshots}
                selectedItems={selectedOneShots}
                onItemClick={toggleOneShotSelection}
                isFavourite={isFavourite}
                onFavouriteClick={toggleFavourite}
              />
            )}
          </div>
        </div>

        <div className='soundboard-section'>
          <Row>
            <Col>
              <ScenePlayer
                selectedScene={selectedScene}
                sceneVolume={sceneVolume}
                onVolumeChange={setSceneVolume}
                sceneMode={sceneMode}
                onSceneModeChange={setSceneMode}
                onPlayScene={playScene}
                isScenePaused={isScenePaused}
                onTogglePause={togglePauseScene}
              />
            </Col>
            <Col>
              <AmbiencePlayer
                selectedAmbiences={selectedAmbiences}
                onAmbienceClick={toggleAmbiencePlayback}
                ambienceVolumes={ambienceVolumes}
                onAmbienceVolumeChange={setAmbienceVolume}
              />
            </Col>
            <Col>
              <OneShotPlayer
                selectedOneShots={selectedOneShots}
                onOneShotClick={playOneShot}
                oneshotVolume={oneshotVolume}
                onOneShotVolumeChange={setOneShotVolume}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default SoundBoard
