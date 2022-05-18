from src.logic.Database import Database

class Agenda(Database):

    def addContent(self, object, agenda):

        # checks if the database exists
        agenda.checkRegisters()

        # checks if an objects info is already stored in the database
        check = agenda.checkContents(object.type, object.aniList_ID)

        if (check == False):

            # add the content to the database
            agenda.addRow(object)

            # update the rows indexes
            agenda.updateAllRowsIndexes(object.type)

            # return a message response
            return (f"Succesfully added!")

        else:

            # return a message response
            return (f"Already on your list!")

    def removeContent(self, type, target_id, agenda):

        # removing row
        response = agenda.remove_row(target_id, type)

        # update the rows indexes
        agenda.updateAllRowsIndexes(type)

        # return response
        return response