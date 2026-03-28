import React from 'react'
import { API_BASE_URL } from '../pages/soundboard/utils/constants'
import { Row, Col, Form } from 'react-bootstrap'

function AdminSoundListComponent({
  type,
  items,
  formSubmitHandler
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
        <Form onSubmit={formSubmitHandler}>
          {items.map(item => (
            <Col key={item.slug} xs={12} className="mb-2 px-0">
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
              <Form.Check 
                type="checkbox"
                name={`delete-${item.slug}`}
              />
            </Col>
          ))}
        </Form>
      </Row>
    </div>
  )
}

export const AdminSoundList = React.memo(AdminSoundListComponent)