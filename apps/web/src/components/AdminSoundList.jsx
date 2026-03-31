import React from 'react'
import { API_BASE_URL } from '../pages/soundboard/utils/constants'
import { Row, Col, Form } from 'react-bootstrap'

function AdminSoundListComponent({
  type,
  items,
  deleteFormSubmitHandler,
  formId,
  searchResults
}) {
  const className = {
    scene: 'scene-item',
    ambience: 'ambience-item',
    oneshot: 'oneshot-item'
  }[type]

  const listClassName = {
    scene: 'scenes-list',
    ambience: 'ambiences-list',
    oneshot: 'oneshots-list'
  }[type]

  const nameClassName = {
    scene: 'scene-name',
    ambience: 'ambience-name',
    oneshot: 'oneshot-name'
  }[type]

  return (
        <Form id={formId} onSubmit={deleteFormSubmitHandler}>
              <div className={`${listClassName} admin-sound-list`}>
          {searchResults.length == 0 ? (items.map(item => (
            <div key={item.slug} className={className}>
              <div style={{position: 'absolute', top: '6px', left: '6px', zIndex: 10, backgroundColor: 'rgba(255 255, 255, 0.9)', padding: '3px 6px', borderRadius: '6px'}}>
                <Form.Check
                  type="checkbox"
                  name={`delete-${item.slug}`}
                  style={{transform: 'scale(1.3)', cursor:'pointer'}}
                  id={`selector-box-${item.slug}`}
                />
              </div>
              <div className={className}>
                <div className={nameClassName}>
                  <img
                    src={`${API_BASE_URL}/content/thumb/${item.slug}`}
                    alt={item.title}
                    width={type === 'scene' ? undefined : "50px"}
                    height={type === 'scene' ? undefined : "50px"}
                  />
                  {type === 'scene' ? (
                    <div className='item-title-text'>{item.title}</div>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </div>
              </div>
          ))) : (
            searchResults.map(item => (
              <div key={item.slug} className={className}>

                <div style={{position: 'absolute', top: '6px', left: '6px', zIndex: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '3px 6px', borderRadius: '6px'}}>
                  <Form.Check
                    type="checkbox"
                    name={`delete-${item.slug}`}
                    style={{ transform: 'scale(1.3)', cursor: 'pointer'}}
                    id={`selector-box-${item.slug}`}
                  />
                </div>
                <div className={className} onClick={() => document.getElementById(`selector-box-${item.slug}`).click()}>
                  <div className={nameClassName}>
                    <img
                      src={`${API_BASE_URL}/content/thumb/${item.slug}`}
                      alt={item.title}
                      width={type === 'scene' ? undefined : "50px"}
                      height={type === 'scene' ? undefined: "50px"}
                    />
                    {type === 'scene' ? (
                    <div className='item-title-text'>{item.title}</div>
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </div>
                </div>
            ))
          )}
          </div>
        </Form >
  )
}

export const AdminSoundList = React.memo(AdminSoundListComponent)