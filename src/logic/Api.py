import requests
import json
from src.logic.Agenda import Agenda
from src.logic.Manga import Manga
from src.logic.Anime import Anime
from datetime import date


class Api(Agenda):

    def titleSearch(self, title, type, page_number):

        if type == 'ANIME':

            # create query
            query = '''
                    query ($page: Int, $perPage: Int, $search: String){
                        Page(page: $page, perPage: $perPage) {
                            pageInfo {
                                total
                                perPage
                                currentPage
                                hasNextPage
                            }
                            media(search: $search, type: ANIME) {
                                id
                                title {
                                    romaji
                                }
                                coverImage {
                                    large
                                }
                                isAdult
                            }  
                        }
                    }
                    '''

            # Define our query variables and values that will be used in the query request
            variables = {
                'search': title,
                'page': page_number,
                'perPage': 4,
            }

            # anilist api url
            url = 'https://graphql.anilist.co'

            # Make the HTTP Api request
            results = requests.post(url, json={'query': query, 'variables': variables}, timeout=5).json()

            return results

        else:
                # create query
                query = '''
                         query ($page: Int, $perPage: Int, $search: String){
                            Page(page: $page, perPage: $perPage) {
                                pageInfo {
                                    total
                                    perPage
                                    currentPage
                                    hasNextPage
                                }
                                media(search: $search, type: MANGA) {
                                    id
                                    title {
                                        romaji
                                    }
                                    coverImage {
                                        large
                                    }
                                    isAdult
                                }  
                            }
                        }
                  '''

                # Define our query variables and values that will be used in the query request
                variables = {
                    'search': title,
                    'page': page_number,
                    'perPage': 4,
                }

                # anilist api url
                url = 'https://graphql.anilist.co'

                # Make the HTTP Api request
                results = requests.post(url, json={'query': query, 'variables': variables}, timeout=5).json()

                return results

    def getResults(self, results, type, pref):

        # checks if there are results
        pageInfo = results['data']['Page']['pageInfo']

        if pageInfo['total'] == 0:
            return 'No results'

        else:
            if pref == 'adult':
                # get the media list size
                size = len(results['data']['Page']['media'])

                # creates a dictionary
                Dictionary = {0: {'CurrentPage': results['data']['Page']['pageInfo']['currentPage'],
                                  'Hasnextpage': results['data']['Page']['pageInfo']['hasNextPage'], 'type': type}}

                for i in range(size):

                    # creates a dictionary
                    dic = {i + 1: {'Title': results['data']['Page']['media'][i]['title']['romaji'],
                                   'coverImage': results['data']['Page']['media'][i]['coverImage']['large'],
                                   'id': results['data']['Page']['media'][i]['id']}}

                    # add dictionary "dic" to "Dictionary"
                    Dictionary.update(dic)

                # convert dictionary to json
                json_string = json.dumps(Dictionary)

                # return Dictionary
                return json_string

            else:
                # get the media list size
                size = len(results['data']['Page']['media'])

                # create a dictionary
                Dictionary = {0: {'CurrentPage': results['data']['Page']['pageInfo']['currentPage'],
                                  'Hasnextpage': results['data']['Page']['pageInfo']['hasNextPage'], 'type': type}}
                
                #create an iterator for dictionary keys
                iterator = 0

                for i in range(size):
                    #if the media 
                    if results['data']['Page']['media'][i]['isAdult'] != True:

                        # creates a dictionary
                        dic = {iterator + 1: {'Title': results['data']['Page']['media'][i]['title']['romaji'],
                                       'coverImage': results['data']['Page']['media'][i]['coverImage']['large'],
                                       'id': results['data']['Page']['media'][i]['id']}}

                        iterator += 1

                        # add dictionary "dic" to "Dictionary"
                        Dictionary.update(dic)

                # convert dictionary to json
                json_string = json.dumps(Dictionary)

                # return Dictionary
                return json_string

    def previewData(self, id, type):

        if type == 'ANIME':

            # create query
            query = '''
                    query ($id: Int) {
                        Media (id: $id, type: ANIME) {
                            id
                            title {
                                romaji
                            }
                            type
                            episodes
                            status
                            description
                            coverImage {
                                large
                            }
                            genres
                            rankings {
                                rank
                                allTime
                                type
                            }
                            averageScore
                            studios {
                                nodes {
                                name
                                isAnimationStudio
                                }
                            }
                        }
                    }
                '''

            # Define our query variables and values that will be used in the query request
            variables = {
                'id': id
            }

            url = 'https://graphql.anilist.co'

            # Make the HTTP Api request
            results = requests.post(url, json={'query': query, 'variables': variables}, timeout=5).json()

            # organizing data
            data = results['data']['Media']

            # title
            title = data['title']['romaji']

            # id
            id = data['id']

            # type
            format = data['type']

            # status
            status = data['status']

            # description
            description = data['description']

            # episodes
            episodes = data['episodes']

            # average score
            averageScore = data['averageScore']

            # genre
            genre = data['genres']

            # coverImage
            coverImage = data['coverImage']['large']

            # ranking
            rank = None
            rankings = data['rankings']
            if rankings != []:
                for i in range(len(rankings)):
                    if data['rankings'][i]['type'] == "RATED" and data['rankings'][i]['allTime'] == True:
                        rank = data['rankings'][i]['rank']

            # animation studio
            animationStudio = None
            studios = data['studios']['nodes']
            if studios != []:
                for i in range(len(studios)):
                    if data['studios']['nodes'][i]['isAnimationStudio'] == True:
                        animationStudio = data['studios']['nodes'][i]['name']

            # creates a dictionary
            Dictionary = {'Title': title, 'Id': id, 'Type': format, 'Status': status, 'Description': description,
                          'Episodes': episodes,
                          'genres': genre, 'Averagescore': averageScore, 'Animationstudio': animationStudio,
                          'Ranking': rank, 'coverImage': coverImage}

            # convert dictionary to json
            Dictionary = json.dumps(Dictionary)

            return Dictionary


        else:
            # create query
            query = '''
                    query ($id: Int) { 
                        Media (id: $id, type: MANGA) { 
                            id
                            title {
                                romaji
                            }
                            genres
                            type
                            status
                            description
                            chapters
                            volumes
                            coverImage {
                                large
                            }
                            averageScore
                            rankings {
                                rank
                                allTime
                                type
                            }
                        }
                    }
                '''

            # Define our query variables and values that will be used in the query request
            variables = {
                'id': id
            }

            url = 'https://graphql.anilist.co'

            # Make the HTTP Api request
            results = requests.post(url, json={'query': query, 'variables': variables}, timeout=5).json()

            # organizing data
            data = results['data']['Media']

            # title
            title = data['title']['romaji']

            # id
            id = data['id']

            # type
            format = data['type']

            # genre
            genre = data['genres']

            # status
            status = data['status']

            # description
            description = data['description']

            # average score
            averageScore = data['averageScore']

            # episodes
            episodes = data['chapters']

            # volumes
            volumes = data['volumes']

            # coverImage
            coverImage = data['coverImage']['large']

            # ranking
            rank = None
            rankings = data['rankings']
            if rankings != []:
                for i in range(len(rankings)):
                    if data['rankings'][i]['type'] == "RATED" and data['rankings'][i]['allTime'] == True:
                        rank = data['rankings'][i]['rank']

            Dictionary = {'Title': title, 'Id': id, 'Type': format, 'Volumes': volumes, 'Status': status,
                          'Description': description, 'Episodes': episodes,
                          'genres': genre, 'Averagescore': averageScore, 'Ranking': rank, 'coverImage': coverImage}

            # convert dictionary to json
            Dictionary = json.dumps(Dictionary)

            return Dictionary

    def getData(self, id, type):

        def returnObject(results, type):
            # organize data
            data = results['data']['Media']

            # title
            title = data['title']['romaji']

            # id
            id = data['id']

            # type
            format = data['type']

            # cover image
            coverimage = data['coverImage']['large']

            if type == 'ANIME':

                # episodes
                episodes = data['episodes']

                if episodes == None:
                    episodes = '-'

                # create anime object
                anime = Anime(title, id, format, 'ONGOING', "0", episodes, date.today(), coverimage, "0")

                return anime

            else:
                # episodes
                episodes = data['chapters']

                if episodes == None:
                    episodes = '-'

                # create manga object
                manga = Manga(title, format, id, 'ONGOING', "0", episodes, date.today(), coverimage, "0")

                return manga

        if type == 'ANIME':

            # create query
            query = '''
                    query ($id: Int) {
                        Media (id: $id, type: ANIME) {
                            id
                            type
                            title {
                                romaji
                            }
                            startDate{
                                year
                                month
                                day                     
                            }
                            episodes
                            status
                            coverImage {
                                large
                            }
                        }
                    }
                    '''

            # Define our query variables and values that will be used in the query request
            variables = {
                'id': id
            }

            # anilist api url
            url = 'https://graphql.anilist.co'

            # Make the HTTP Api request
            results = requests.post(url, json={'query': query, 'variables': variables}, timeout=5).json()

            object = returnObject(results, type)

            return object

        else:
            # create query
            query = '''
            query ($id: Int) { 
                Media (id: $id, type: MANGA) { 
                    id
                    type
                    title {
                        romaji
                    }
                    genres
                    startDate{
                        year
                        month
                        day                     
                    }
                    status
                    chapters
                    coverImage {
                        large
                    }
                }
            }
            '''

            # Define our query variables and values that will be used in the query request
            variables = {
                'id': id
            }

            url = 'https://graphql.anilist.co'

            # Make the HTTP Api request
            results = requests.post(url, json={'query': query, 'variables': variables}, timeout=5).json()

            object = returnObject(results, type)

            return object

    def recommendation(self, id):

        query = '''
                query ($page: Int, $perPage: Int, $mediaId: Int) {
                    Page(page: $page, perPage: $perPage) {
                         pageInfo {
                             total
                            perPage
                            currentPage
                            hasNextPage
                            }
                            recommendations(mediaId: $mediaId){
                                mediaRecommendation {
                                id
                                title {
                                    romaji
                                }
                                type
                                coverImage {
                                    large
                                }
                            }
                        }
                    }
                }
                '''

        # Define our query variables and values that will be used in the query request
        variables = {
            'mediaId': id,
            'page': 1,
            'perPage': 4
        }

        url = 'https://graphql.anilist.co'

        # Make the HTTP Api request
        response = requests.post(url, json={'query': query, 'variables': variables}).json()

        # checks if there are results
        if response['data']['Page']['pageInfo']['total'] == 0:

            return 'No recommendations available'

        else:
            return response