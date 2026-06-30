function participantOnly(req, res, next) {
  if (req.user.role !== "participant") {
    return res.status(403).json({
      message: "Participant access only",
    });
  }

  next();
}

function OrganizerOrAdmin(req, res, next) {
  if (req.user.role !== "organizer" && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Organizer or Admin access only",
    });
  }

  next();
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
}

module.exports = {
  participantOnly,OrganizerOrAdmin,adminOnly,
};