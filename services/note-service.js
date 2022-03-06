const Note = require("../models/Note");

class NoteService {
  async delete(id) {
    if (!id) {
      throw new Error("не указан ID");
    }
    const deletedTask = await Note.findByIdAndDelete(id);
    return deletedTask;
  }

  async update(note) {
    if (!note._id) {
      throw new Error("не указан ID");
    }
    const updatedNote = await Note.findOneAndUpdate({ _id: note._id }, note, {
      new: true,
      runValidators: true,
    });
    return updatedNote;
  }

  async getAll(user, sort) {
    let notes;
    switch (sort) {
      case "newest":
        notes = await Note.find({ user: user, category: null, status: 1 }).sort(
          {
            dataCreated: -1,
          }
        );
        break;

      case "oldest":
        notes = await Note.find({ user: user, category: null, status: 1 }).sort(
          {
            dataCreated: 1,
          }
        );
        break;

      default:
        notes = await Note.find({ user: user, category: null, status: 1 }).sort(
          {
            dataCreated: -1,
          }
        );
        break;
    }
    return notes;
  }

  async getNote(user, id) {
    const note = await Note.find({
      user: user,
      _id: id,
      category: null,
      status: 1,
    });
    return note;
  }

  async getNotesCategorySort(user, id) {
    const notes = await Note.find({ user: user, category: id, status: 1 }).sort(
      {
        dataCreated: -1,
      }
    );
    return notes;
  }

  async getNotesBasket(user) {
    const notes = await Note.find({ user: user, status: 3 }).sort({
      dataCreated: -1,
    });
    return notes;
  }

  async getArchiveNotes(user, sort, id) {
    let notes;
    switch (sort) {
      case "newest":
        notes = await Note.find({ user: user, status: 2 }).sort({
          dataCreated: -1,
        });
        break;

      case "oldest":
        notes = await Note.find({ user: user, status: 2 }).sort({
          dataCreated: 1,
        });
        break;

      case "newestInArchive":
        notes = await Note.find({ user: user, status: 2 }).sort({
          statusData: -1,
        });
        break;

      case "oldestInArchive":
        notes = await Note.find({ user: user, status: 2 }).sort({
          statusData: 1,
        });
        break;

      case "category":
        notes = await Note.find({ user: user, status: 2, category: id }).sort({
          statusData: -1,
        });
        break;

      default:
        notes = await Note.find({ user: user, status: 2 }).sort({
          statusData: -1,
        });
        break;
    }
    return notes;
  }

  async getCategoryNotes(user, sort, id) {
    let notes;
    switch (sort) {
      case "newest":
        notes = await Note.find({ user: user, category: id }).sort({
          dataCreated: -1,
        });
        break;

      case "oldest":
        notes = await Note.find({ user: user, category: id }).sort({
          dataCreated: 1,
        });
        break;

      case "newestInCategory":
        notes = await Note.find({ user: user, category: id }).sort({
          categoryData: -1,
        });
        break;

      case "oldestInCategory":
        notes = await Note.find({ user: user, category: id }).sort({
          categoryData: 1,
        });
        break;

      default:
        notes = await Note.find({ user: user, category: id }).sort({
          dataCreated: -1,
        });
        break;
    }
    return notes;
  }
}

module.exports = new NoteService();
