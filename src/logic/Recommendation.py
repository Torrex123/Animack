from src.logic.Api import Api
from src.logic.Database import Database
import json

class Recommendation(Api, Database):

    def getRecommendation(self, data, recom):

        def organizeRecommendation(list):

            # creates a dictionary
            Dictionary = {0: {'title': f'{list[0]}'}}

            # organize data
            data = list[1]['data']['Page']['recommendations']

            for i in range(len(data)):

                # creates a temporary dic
                dic = {i + 1: {'Title': data[i]['mediaRecommendation']['title']['romaji'],
                               'coverImage': data[i]['mediaRecommendation']['coverImage']['large'],
                               'id': data[i]['mediaRecommendation']['id']}}

                # add dictionary "dic" to "Dictionary"
                Dictionary.update(dic)

            # convert dictionary to json
            json_string = json.dumps(Dictionary)

            return json_string


        results = recom.recommendation(data[0][1])

        if results != 'No recommendations available':

            # get title
            title = data[0][2]

            # save title and recommendations in a list
            list = [title, results]

            # organize recommendations
            response = organizeRecommendation(list)

            return response

        else:

            return results





