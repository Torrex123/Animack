from src.logic.Database import Database

class Customization(Database):

    def changeScore(self, score, customization, type, id):
        # update the scores
        customization.updateRowScore(type, score, id)

    def changeProgress(self, progress, customization, type, id):
        # update the progress
        customization.updateRowProgress(type, progress, id)

    def changeStatus(self, episode, progress, customization, type, id):

        if(episode == progress):
            #Set the row progress as 'FINISHED'
            customization.updateRowStatus(type, 'FINISHED', id)
        else:
            # Set the row progress as 'ONGOING'
            customization.updateRowStatus(type, 'ONGOING', id)
