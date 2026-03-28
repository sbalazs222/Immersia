import React from 'react'
import { API_BASE_URL } from '../pages/soundboard/utils/constants'
import { Row, Col, Form } from 'react-bootstrap'

function AdminSoundListComponent({
  type,
  items,
  deleteFormSubmitHandler,
  formId
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
    <div className={`${listClassName} admin-sound-list`}>
      <Row className="g-0">
        <Form id={formId} onSubmit={deleteFormSubmitHandler}>
          {items.map(item => (
            <Col key={item.slug} xs={12} className="mb-2 px-0 admin-item-row">
              <div className="admin-item-checkbox">
                <Form.Check
                  type="checkbox"
                  name={`delete-${item.slug}`}
                />
              </div>
              <div className={className}>

                <div className={nameClassName}>
                  <img
                    src={`${API_BASE_URL}/content/thumb/${item.slug}`}
                    alt={item.title}
                    width="50px"
                    height="50px"
                  />
                  {item.title}
                </div>
              </div>
            </Col>
          ))}
        </Form >
      </Row>
    </div>
  )
}

export const AdminSoundList = React.memo(AdminSoundListComponent)