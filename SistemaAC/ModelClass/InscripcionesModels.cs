using SistemaAC.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SistemaAC.ModelClass
{
    public class InscripcionesModels
    {
        private ApplicationDbContext context;

        public InscripcionesModels(ApplicationDbContext context)
        {
            this.context = context;
        }

    }
}
