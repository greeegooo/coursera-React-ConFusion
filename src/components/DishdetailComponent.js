import React, { useState } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Row, Label, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

function formatDate(dateString) {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(dateString)));
}

function RenderDish({dish}){

    let view = (<div></div>);

    if(dish){
        view = (
            <FadeTransform in transformProps={{exitTransform: 'scale(0.5) translateY(-50%)'}}>
                <Card>
                    <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        )
    }

    return view;
}

const CommentForm = (props) => {

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const submit = (values) => {
        props.postComment(props.dishId, values.rating, values.name, values.comment);
        toggle();
    }
    const required = (val) => val && val.length;
    const maxLength = (len) => (val) => !(val) || (val.length <= len);
    const minLength = (len) => (val) => val && (val.length >= len);

    return(
        <div>

            <Button outline onClick={toggle}>
                <span className="fa fa-pencil fa-lg"></span> 
                Submit Comment
            </Button>

            <Modal isOpen={modal} toggle={toggle}>

                <ModalHeader toggle={toggle}>Submit Comment</ModalHeader>

                <ModalBody>

                    <LocalForm onSubmit={submit}>
                        
                        <Row className="form-group">
                            <Label htmlFor="rating" md={2}>Rating</Label>
                            <Col md={12}>
                                <Control.select 
                                    model=".rating" 
                                    name="rating"
                                    className="form-control">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="name" md={3}>Your Name</Label>
                            <Col md={12}>
                                <Control.text 
                                    model=".name" 
                                    id="name" 
                                    name="name"
                                    className="form-control"
                                    validators={{
                                        required, 
                                        minLength: minLength(3), 
                                        maxLength: maxLength(15)
                                    }}
                                />
                                <Errors
                                    className="text-danger"
                                    model=".name"
                                    show="touched"
                                    messages={{
                                        required: 'Required. ',
                                        minLength: 'Must be greater than 2 characters. ',
                                        maxLength: 'Must be 15 characters or less. '
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="comment" md={2}>Comment</Label>
                            <Col md={12}>
                                <Control.textarea 
                                    model=".comment" 
                                    id="comment" 
                                    name="comment"
                                    rows="6"
                                    className="form-control" 
                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col>
                                <Button type="submit" color="primary">Submit</Button>
                            </Col>
                        </Row>

                    </LocalForm>

                </ModalBody>

            </Modal>

        </div>
    );
}

function RenderComments({comments, postComment, dishId}){

    let view = (<div></div>);

    if(comments){
        view = (
            <div>
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map(c => {
                            return(
                                <Fade in>
                                    <li key={c.id}>
                                        <p>{c.comment}</p>
                                        <p>-- {c.author}, {formatDate(c.date)}</p>
                                    </li>
                                </Fade>
                            );
                        })}
                    </Stagger>
                </ul>
                <CommentForm 
                    dishId={dishId} 
                    postComment={postComment}
                />
            </div>
        )
    }

    return view;
}

const Dishdetail = (props) => {

    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">            
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if (props.dish != null) {
        return (
            <div className="container">
                
                <div className="row">
    
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
    
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>   
                                 
                </div>
                
                <div className="row">
    
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish}/>
                    </div>
    
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments 
                            comments={props.comments} 
                            postComment={props.postComment}
                            dishId={props.dish.id}
                        />
                    </div>
    
                </div>
    
            </div>
        );
    }
}

export default Dishdetail;
