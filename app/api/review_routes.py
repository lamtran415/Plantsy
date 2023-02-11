from flask import Blueprint, jsonify, session, request
from ..models.review import Review
from ..forms.review_form import ReviewForm
from ..models import db

review_routes = Blueprint('review', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

# get all reviews of a spot
# @review_routes.route('/<int:plantId>/reviews') #  ****  throw this into plants route *****
# def all_reviews(plantId):
#   """ Route to return and display all the reviews of a plant """
#   reviews = Review.query.filter(Review.plant_id == plantId) #.join user table, review images
#   return reviews.to_dict() # add somethign to check if there is even anything inside the query, if not repond with an error


# create a review
# @review_routes.route('/<int:plantId>/reviews', methods=['POST'])
# def create_review():
    # """Route to create a new review"""
#   form = ReviewForm()
#   if form.validate_on_submit():
#     request_data = request.get_json()
#     new_review = Review(request_data)
#     db.session.add(new_review)
#     db.session.commit()
#     return new_review.to_dict()
#   return {'errors': validation_errors_to_error_messages(form.errors)}, 401

#create review v2
# @review_routes.route('/<int:plantId>/reviews', methods=['POST'])
# def create_review():
  # """ Route to create a new review """
#   form = ReviewForm()
#   if form.validate_on_submit():
#     request_data = request.get_json()
#     new_review = Review(
#       review=request_data.get('review'),
#       stars=request_data.get('stars'),
#       plant_id=plantId
#     )
#     db.session.add(new_review)
#     db.session.commit()
#     return new_review.to_dict()
#   return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# delete a review
@review_routes.route('/<int:reviewId>', methods=['DELETE'])
def delete_review(reviewId):
  """ Route to delete a review """
  review = Review.query.get(reviewId)
  if review is None:
    return 'error, review not found', 404
  db.session.delete(review)
  db.session.commit()
  return "Review deleted successfully", 200


@review_routes.route('/<int:reviewId>', methods=['PUT'])
def edit_review(reviewId):
  """ Route to edit a review """
  review = Review.query.get(reviewId)
  if review is None:
    return 'error, review not found', 404

  update_data = request.get_json()
  form = ReviewForm(data=update_data)
  if form.validate_on_submit():
    form.populate_obj(review)
    db.session.commit()
    return review.to_dict(), 200

  return {'errors': validation_errors_to_error_messages(form.errors)}, 400
