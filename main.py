import webview
from src.logic.Agenda import Agenda
from src.logic.Api import Api
from src.logic.Database import Database
from src.logic.Customization import Customization
from src.logic.Recommendation import Recommendation
from src.logic.File import File

#create an agenda object'
agenda = Agenda()

#create an Api object
api = Api()

#create a Database object
db = Database()

#create a Recommendation object
recom = Recommendation()

#create a customization object
custom = Customization()

#create a file object
file = File()



class JavaScriptAPI:

    def searchClickButton(self, title, type, page):
        # set a default preference
        file.defaultPreference()

        # get the user preference
        pref = file.getPreference()

        # Api request
        results = api.titleSearch(title, type, page)

        # organize results
        json = api.getResults(results, type, pref)

        return json

    def dataPreviewButton(self, id, type):
        # Api request
        results = api.previewData(id, type)

        return results

    def addButton(self, id, type):
        # Api request
        results = api.getData(id, type)

        # save results in database
        response = api.addContent(results, agenda)

        return response

    def removeButton(self, type, target_id):

        # remove results from database
        response = agenda.removeContent(type, target_id, agenda)

        return response

    def recommendationButton(self, type):
        # Search for a random user content
        data = recom.getRandomRow(type)

        # Search recommendations
        return recom.getRecommendation(data, recom)

    def changeScoreButton(self, score, type, id):

        #change the content score

        custom.changeScore(score, custom, type, id)

    def changeProgressButton(self, progress, type, id):

        #change the content progress
        custom.changeProgress(progress, custom, type, id)

        #get the total title episodes
        episodes = custom.getRowEpisodes(type, id)

        #get the user progress
        progress = custom.getRowProgress(type, id)

        #change the status
        custom.changeStatus(episodes, progress, custom, type, id)
    
    def getTotalRowsNumber(self, type):

        #checks if the database exists
        db.checkRegisters()

        #set a default preference
        file.defaultPreference()

        #return a table row numbers
        return db.countRows(type)

    def getDatabaseRow(self, type, index):

        #return a row from the database
        return db.getRows(type, index)

    def exportButton(self, route, file_name):

        #check if the database exists
        check_existence = file.checkDatabaseExistence()

        if(check_existence):
            #saves a copy of the database
            file.saveDatabaseCopy(route, file_name)

    def deleteDatabaseButton(self):

        # check if the database exists
        check_existence = file.checkDatabaseExistence()

        # saves a copy of the database
        return file.deleteAllData(check_existence)

    def importButton(self, route):

        # check if the database exists
        check_existence = file.checkDatabaseExistence()

        #overwrite the database with a new file
        file.overwriteDatabase(route, check_existence)

    def preferenceButton(self, preference):

        #save user preference
        file.preferences(preference)
     
    def defaultPreference(self):

        #get the user preference
        return file.getPreference()

    def openFileDialog(self):

        #get the route to the imported file
        return open_file_dialog(window)

    def saveFileDialog(self):

        #get the route to the imported file
        return save_file_dialog(window)



# WINDOW FUNCTIONS:

# Function to load the window content.
def load_url(window):
    window.load_url('./src/views/intro.html')

# Function to open an 'open file dialog'.
def open_file_dialog(window):
    file_types = ('Database Files (*.db)',)

    result = window.create_file_dialog(webview.OPEN_DIALOG, allow_multiple=False, file_types=file_types)
    return result

# Function to open a 'save file dialog'.
def save_file_dialog(window):

    result = window.create_file_dialog(webview.SAVE_DIALOG, directory='/', save_filename='myList.db')
    return result



jsapi = JavaScriptAPI()

window = webview.create_window(title='Animack', js_api = jsapi, width = 1280, height = 720, \
                      resizable = False, fullscreen = False, text_select = False, confirm_close = True)

webview.start(load_url, window, debug=True)